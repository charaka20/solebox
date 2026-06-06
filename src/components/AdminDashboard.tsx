import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Product, Order } from "../types";
import { Plus, ShieldAlert, Sparkles, Trash2, Bell, Mail } from "lucide-react";

interface AdminDashboardProps {
  onClose: () => void;
}

const PRESET_IMAGES = [
  {
    name: "Air Jordan 1 Travis Scott",
    url: "/images/1.png"
  },
  {
    name: "New Balance 550 ALD",
    url: "/images/2.png"
  },
  {
    name: "Nike Dunk Low Panda Noir",
    url: "/images/3.png"
  },
  {
    name: "Yeezy Boost 350 Onyx",
    url: "/images/4.png"
  }
];

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { 
    orders, 
    addNewProduct, 
    updateOrderStatus, 
    products, 
    deleteProduct, 
    toggleProductStock, 
    notifications,
    productStockMap,
    updateProductStock
  } = useApp();

  const [activeTab, setActiveTab] = useState<"orders" | "add-shoe" | "manage-shoes" | "stock-alerts">("add-shoe"); // Default tab directly onto user's requested shoe manager!
  
  // Custom Shoe Form State
  const [shoeName, setShoeName] = useState("");
  const [shoeBrand, setShoeBrand] = useState("Asics");
  const [customBrand, setCustomBrand] = useState("");
  const [shoePrice, setShoePrice] = useState("26000");
  const [shoeDescription, setShoeDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<number[]>([40, 41, 42, 43, 44]);
  const [formStock, setFormStock] = useState<Record<string, string>>({
    "40": "5", "41": "5", "42": "5", "43": "5", "44": "5"
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stock management inline editor states
  const [editingStockProductId, setEditingStockProductId] = useState<string | null>(null);
  const [tempStockMap, setTempStockMap] = useState<Record<string, number>>({});

  // Order status modification state variables
  const [selectedTracking, setSelectedTracking] = useState<Record<string, string>>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});

  const handleToggleSize = (size: number) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
      if (!formStock[String(size)]) {
        setFormStock((prev) => ({ ...prev, [String(size)]: "5" }));
      }
    }
  };

  const handleCreateShoe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!shoeName.trim()) {
      setFormError("Sneaker name cannot be blank.");
      return;
    }

    const priceNum = parseFloat(shoePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please state a higher valid numerical value for LKR price.");
      return;
    }

    if (selectedSizes.length === 0) {
      setFormError("Please check at least one US/EUR size package.");
      return;
    }

    const brandName = shoeBrand === "Custom" ? customBrand.trim() : shoeBrand;
    if (!brandName) {
      setFormError("Please list or select a valid footwear brand manufacturer.");
      return;
    }

    const targetUrl = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    const uniqueId = "snkr-imp-" + Math.random().toString(36).substr(2, 6);

    const newShoeData: Omit<Product, "isCustomImport"> = {
      id: uniqueId,
      name: shoeName.trim(),
      brand: brandName,
      price: priceNum,
      sizes: selectedSizes,
      description: shoeDescription.trim() || "A beautiful upcoming premium import handpicked by SoleBox LK curation team.",
      image: targetUrl,
    };

    const sizeStockBuild: Record<string, number> = {};
    selectedSizes.forEach((size) => {
      const qtyStr = formStock[String(size)] || "5";
      const parsed = parseInt(qtyStr, 10);
      sizeStockBuild[String(size)] = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    });

    try {
      setIsSubmitting(true);
      await addNewProduct(newShoeData, sizeStockBuild);
      
      setFormSuccess(true);
      // Reset form variables
      setShoeName("");
      setShoeDescription("");
      setCustomBrand("");
      setCustomImageUrl("");
      setFormStock({ "40": "5", "41": "5", "42": "5", "43": "5", "44": "5" });
    } catch (err: any) {
      setFormError(err?.message || "Sneaker upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatusAndTracking = async (orderId: string, status: Order["status"]) => {
    const tracking = selectedTracking[orderId] || "";
    try {
      setIsUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));
      await updateOrderStatus(orderId, status, tracking || undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-reveal">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-900 p-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-1.5 rounded font-mono text-[9px] uppercase font-bold tracking-widest">
              ROLE: Administrator Secure
            </div>
            <h3 className="font-display font-black text-sm tracking-widest text-white uppercase hidden sm:block">
              SOLEBOX PORTAL CONSOLE
            </h3>
          </div>

          <button
            id="admin-dashboard-close"
            onClick={onClose}
            className="text-xs font-mono tracking-widest text-zinc-500 hover:text-white uppercase cursor-pointer"
          >
            DISMISS
          </button>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex border-b border-zinc-900 font-mono text-xs overflow-x-auto">
          <button
            id="tab-add-shoe"
            onClick={() => {
              setActiveTab("add-shoe");
              setFormSuccess(false);
              setFormError("");
            }}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-4 uppercase text-center tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === "add-shoe"
                ? "border-[#C9A84C] text-[#C9A84C] font-black bg-zinc-900/30"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            ADD SNEAKER IMPORTS
          </button>

          <button
            id="tab-orders"
            onClick={() => setActiveTab("orders")}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-4 uppercase text-center tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === "orders"
                ? "border-[#C9A84C] text-[#C9A84C] font-black bg-zinc-900/30"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            PENDING ORDERS ({orders.length})
          </button>

          <button
            id="tab-manage-shoes"
            onClick={() => setActiveTab("manage-shoes")}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-4 uppercase text-center tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === "manage-shoes"
                ? "border-[#C9A84C] text-[#C9A84C] font-black bg-zinc-900/30"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            MANAGE CATALOG ({products.length})
          </button>

          <button
            id="tab-stock-alerts"
            onClick={() => setActiveTab("stock-alerts")}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-4 uppercase text-center tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === "stock-alerts"
                ? "border-[#C9A84C] text-[#C9A84C] font-black bg-zinc-900/30"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            STOCK ALERTS ({notifications.length})
          </button>
        </div>

        {/* Content Viewbox */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {activeTab === "add-shoe" && (
            /* ADD SNEAKER IMPORTS FORM SECTION */
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[#C9A84C] font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles size={11} />
                  <span>Favorite Sneaker Sourcing Curation</span>
                </div>
                <h4 className="font-display font-black text-xl text-white uppercase">ADD NEW DROP TO E-STORE</h4>
                <p className="font-sans text-xs text-zinc-400 font-normal">
                  Define upcoming sneaker imports and deploy them live to the catalog immediately. Standard clients can then browse, order, or submit cash-on-delivery purchases.
                </p>
              </div>

              {formSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded text-center space-y-2 animate-reveal">
                  <p className="text-[#C9A84C] font-mono text-xs uppercase font-black">✨ NEW SNEAKER DROP REGISTERED SUCCESSFUL !</p>
                  <p className="font-sans text-xs text-zinc-300">
                    The sneaker has been written dynamically to the cloud database collection. Customers will see it live in their drops section in real time.
                  </p>
                  <button
                    id="add-another-shoe-btn"
                    onClick={() => setFormSuccess(false)}
                    className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300 uppercase tracking-wider rounded"
                  >
                    Add Another Drop
                  </button>
                </div>
              )}

              {formError && (
                <div className="bg-red-950/20 border border-red-900/40 p-3 rounded flex items-start gap-2 text-red-400 font-mono text-[10px] uppercase">
                  <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {!formSuccess && (
                <form onSubmit={handleCreateShoe} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Shoe Title */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">Sneaker Import Name</label>
                      <input
                        id="form-shoe-name"
                        type="text"
                        placeholder="e.g. Air Jordan 4 Bred Reimagined"
                        required
                        value={shoeName}
                        onChange={(e) => setShoeName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                      />
                    </div>

                    {/* Shoe Price LKR */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">ESTIMATED PRICE (LKR)</label>
                      <input
                        id="form-shoe-price"
                        type="number"
                        placeholder="28000"
                        required
                        value={shoePrice}
                        onChange={(e) => setShoePrice(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Brand Manufacturer */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">Brand Cluster</label>
                      <select
                        id="form-shoe-brand"
                        value={shoeBrand}
                        onChange={(e) => setShoeBrand(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-zinc-300 p-2.5 rounded font-mono uppercase"
                      >
                        <option value="Nike">Nike (Jordan/Dunk)</option>
                        <option value="Adidas">Adidas (Yeezy/Samba)</option>
                        <option value="New Balance">New Balance (550/9060)</option>
                        <option value="Asics">Asics (Kayano)</option>
                        <option value="Custom">Custom Brand...</option>
                      </select>
                    </div>

                    {/* Custom Brand Optional */}
                    {shoeBrand === "Custom" && (
                      <div className="space-y-1.5 animate-reveal">
                        <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">Custom Brand Name</label>
                        <input
                          id="form-custom-brand"
                          type="text"
                          placeholder="e.g. On Running"
                          required
                          value={customBrand}
                          onChange={(e) => setCustomBrand(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                        />
                      </div>
                    )}
                  </div>

                  {/* Sizing array selectors */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">Available EUR Sizes Allocation</label>
                    <div className="flex flex-wrap gap-2">
                      {[38, 39, 40, 41, 42, 43, 44, 45, 46].map((size) => {
                        const active = selectedSizes.includes(size);
                        return (
                          <button
                            id={`size-toggle-${size}`}
                            key={size}
                            type="button"
                            onClick={() => handleToggleSize(size)}
                            className={`px-3 py-1.5 text-xs font-mono rounded border select-none cursor-pointer transition-all ${
                              active
                                ? "bg-white text-black border-white font-black"
                                : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-800 hover:text-white"
                            }`}
                          >
                            EUR {size}
                          </button>
                        );
                      })}
                    </div>

                    {selectedSizes.length > 0 && (
                      <div className="mt-4 bg-zinc-900/40 p-4 border border-zinc-900 rounded space-y-3 animate-reveal">
                        <div className="flex items-center gap-1.5 text-[#C9A84C] font-mono text-[9px] uppercase tracking-wider font-bold">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                          <span>Define Stock Quantity per Size Arrival</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {selectedSizes.map((size) => (
                            <div key={size} className="space-y-1">
                              <span className="block font-mono text-[8px] text-zinc-400 uppercase tracking-wide">EUR {size} Qty</span>
                              <input
                                id={`form-stock-size-${size}`}
                                type="number"
                                min="0"
                                required
                                placeholder="5"
                                value={formStock[String(size)] || "5"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormStock((prev) => ({
                                    ...prev,
                                    [String(size)]: val
                                  }));
                                }}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none text-xs text-white p-2 rounded font-mono text-center"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-[9.5px] font-mono text-zinc-500">
                          Cumulative arrival stock: <span className="text-[#C9A84C] font-black">{selectedSizes.reduce((sum, size) => sum + parseInt(formStock[String(size)] || "0", 10), 0)} pairs</span>. If cumulative stock reaches 0, the sneaker will trigger raw OUT OF STOCK warnings.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Unsplash Preset selection versus custom picture URL */}
                  <div className="space-y-2.5">
                    <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">SNEAKER CATALOG IMAGE Selection</label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {PRESET_IMAGES.map((preset, index) => {
                        const active = selectedImage === preset.url && !customImageUrl.trim();
                        return (
                          <button
                            id={`preset-img-${index}`}
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedImage(preset.url);
                              setCustomImageUrl("");
                            }}
                            className={`relative aspect-square rounded overflow-hidden border cursor-pointer ${
                              active ? "border-[#C9A84C] ring-1 ring-[#C9A84C]" : "border-zinc-900 opacity-60 hover:opacity-100"
                            } transition-all`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 inset-x-1 bg-black/80 text-[8px] font-mono text-zinc-400 p-0.5 text-center block max-w-full truncate">
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase">OR PASTE CUSTOM PICTURE URL</span>
                        {customImageUrl.trim() && (
                          <span className="font-mono text-[8px] text-emerald-400 uppercase">CUSTOM IMAGE APPLIED</span>
                        )}
                      </div>
                      <input
                        id="form-custom-image-url"
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                      />
                    </div>
                  </div>

                  {/* High Value Sneaker write-up */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">Curation Story & Description</label>
                    <textarea
                      id="form-shoe-description"
                      rows={3}
                      placeholder="Discuss the materials, color accents, and overall premium aesthetic details of this curated footwear drop."
                      value={shoeDescription}
                      onChange={(e) => setShoeDescription(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                    />
                  </div>

                  <button
                    id="admin-form-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#C9A84C] hover:bg-[#ab862b] disabled:bg-zinc-800 text-black disabled:text-zinc-550 font-display font-black text-xs tracking-widest py-3.5 rounded transition-all cursor-pointer uppercase select-none"
                  >
                    <Plus size={14} />
                    <span>{isSubmitting ? "TRANSMITTING TO STORE DATABASE..." : "DEPLOY DROP LIVE NOW"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            /* REAL-TIME ORDER LOG FOR COD ORDERS */
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <div>
                  <h4 className="font-display font-black text-md text-white uppercase">Client Purchase Logs</h4>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Review delivery status and input courier tracking IDs</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded font-mono text-[10px] text-zinc-300">
                  TOTAL SUBMISSIONS: <span className="text-[#C9A84C] font-black">{orders.length}</span>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-mono text-xs text-zinc-550 uppercase">No orders placed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-zinc-900 bg-[#09090b] p-5 rounded space-y-4">
                      
                      {/* Top line metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-zinc-200 font-bold">{order.id}</span>
                            <span className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 capitalize">
                              {order.status}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-zinc-550 uppercase tracking-wide">
                            BY: {order.userName} ({order.userEmail})
                          </span>
                        </div>

                        <div className="text-right sm:text-right">
                          <span className="font-mono text-[9px] text-zinc-500 block uppercase">{order.date}</span>
                          <span className="font-display font-black text-[#C9A84C] text-sm sm:text-md">LKR {order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-1.5 text-xs">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="text-zinc-300">
                              <span className="font-mono font-bold text-[#C9A84C] mr-2">x{item.quantity}</span>
                              <span>{item.product.name}</span>
                              <span className="font-mono text-[10px] text-zinc-550 ml-2 uppercase">Size EUR {item.size}</span>
                            </div>
                            <span className="font-mono text-zinc-400">LKR {(item.product.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* shipping address detail */}
                      <div className="border-t border-zinc-900 pt-3 text-xs space-y-1">
                        <div className="text-zinc-500 font-mono text-[9px] uppercase">DELIVERY LOGISTIC COORDINATES:</div>
                        <div className="text-zinc-300 font-sans">
                          <span className="font-bold text-zinc-400">Address:</span> {order.deliveryAddress || "N/A"}
                        </div>
                        <div className="text-zinc-300 font-sans flex items-center gap-2">
                          <div><span className="font-bold text-zinc-400">Phone:</span> {order.phone || "N/A"}</div>
                          <a
                            id={`tel-link-${order.id}`}
                            href={`tel:${order.phone}`}
                            className="bg-zinc-900 hover:bg-zinc-800 text-[#C9A84C] font-mono text-[8px] px-2 py-0.5 rounded border border-zinc-800"
                          >
                            CALL RECIPIENT
                          </a>
                        </div>
                      </div>

                      {/* Courier inputs */}
                      <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div className="space-y-1.5">
                          <label className="block font-mono text-[8px] text-zinc-550 uppercase">Input Courier (DMX) tracking identifier</label>
                          <input
                            id={`tracking-input-${order.id}`}
                            type="text"
                            placeholder="e.g. DMX-489025"
                            value={selectedTracking[order.id] || order.courierTracking || ""}
                            onChange={(e) => setSelectedTracking({ ...selectedTracking, [order.id]: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-900 text-xs text-white p-2 rounded"
                          />
                        </div>

                        {/* Order management status triggers */}
                        <div className="space-y-2">
                          <div className="font-mono text-[8px] text-zinc-550 uppercase">Modify Order status in real time</div>
                          <div className="flex gap-1.5 flex-wrap">
                            {(["Pending", "Confirmed", "Shipped", "Delivered"] as const).map((status) => (
                              <button
                                id={`status-${order.id}-${status}`}
                                key={status}
                                onClick={() => handleUpdateStatusAndTracking(order.id, status)}
                                disabled={isUpdatingStatus[order.id]}
                                className={`px-2.5 py-1 text-[9px] font-mono rounded cursor-pointer uppercase transition-colors ${
                                  order.status === status
                                    ? "bg-white text-black font-black"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-85cd"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "manage-shoes" && (
            <div className="space-y-6 animate-reveal">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <div>
                  <h4 className="font-display font-black text-md text-white uppercase font-bold">Catalog Inventory Manager</h4>
                  <p className="font-mono text-[9px] text-zinc-550 uppercase tracking-wider">
                    Instantly take drops out of circulation or delete customized additions
                  </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded font-mono text-[10px] text-zinc-350 font-bold">
                  TOTAL LIVE DROPS: <span className="text-[#C9A84C] font-black">{products.length}</span>
                </div>
              </div>              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => {
                  const sizeStock = productStockMap[product.id] || {};
                  const sizeKeys = Object.keys(sizeStock);
                  const cumulativeStock = sizeKeys.reduce((sum, s) => sum + (sizeStock[s] || 0), 0);
                  const isCumulativeOutOfStock = sizeKeys.length > 0 && cumulativeStock === 0;

                  return (
                    <div
                      key={product.id}
                      className="border border-zinc-900 bg-zinc-950/60 p-4 rounded flex flex-col gap-4 hover:border-zinc-800 transition-all justify-between animate-reveal shadow-sm"
                    >
                      <div className="flex gap-4 items-start justify-between min-w-0">
                        <div className="flex gap-3 items-center min-w-0">
                          {/* Compact Image */}
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 object-cover rounded border border-zinc-900 flex-shrink-0"
                          />
                          
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[8.5px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 uppercase font-black tracking-widest border border-zinc-800">
                                {product.brand}
                              </span>
                              {product.isCustomImport ? (
                                <span className="font-mono text-[8.5px] bg-[#C9A84C]/10 text-[#C9A84C] px-1.5 py-0.5 rounded uppercase font-black border border-[#C9A84C]/20">
                                  CUSTOM Drop
                                </span>
                              ) : (
                                <span className="font-mono text-[8px] bg-zinc-900/60 text-zinc-600 px-1.5 py-0.5 rounded uppercase border border-zinc-900">
                                  Base Drop
                                </span>
                              )}
                            </div>
                            <h5 className="font-sans font-bold text-xs text-white truncate max-w-[150px] sm:max-w-xs" title={product.name}>
                              {product.name}
                            </h5>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display text-xs text-[#C9A84C] font-black">
                                LKR {product.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-zinc-500">•</span>
                              <span className={`font-mono text-[9px] uppercase font-bold ${
                                isCumulativeOutOfStock
                                  ? "text-red-400 bg-red-950/10 px-1.5 py-0.5 rounded border border-red-900/30"
                                  : "text-zinc-400 font-normal"
                              }`}>
                                {isCumulativeOutOfStock ? "⚠️ Out of Stock (0 pairs)" : `📦 Stock: ${cumulativeStock} pairs`}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {product.sizes.map((s) => {
                                const qty = sizeStock[String(s)] ?? 0;
                                return (
                                  <span 
                                    key={s} 
                                    className={`font-mono text-[8px] border px-1 py-0.5 rounded flex items-center gap-1 ${
                                      qty === 0
                                        ? "text-red-500/70 border-red-950/30 bg-red-950/5"
                                        : "text-zinc-500 border-zinc-900 bg-zinc-900/20"
                                    }`}
                                    title={`EUR ${s}: ${qty} available`}
                                  >
                                    <span>#{s}</span>
                                    <span className={`font-black ${qty === 0 ? "text-red-400" : "text-zinc-300"}`}>({qty})</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Action Triggers */}
                        <div className="flex gap-2 flex-shrink-0 items-center">
                          <button
                            id={`toggle-stock-${product.id}`}
                            onClick={() => toggleProductStock(product.id)}
                            className={`font-mono text-[9px] font-bold px-2 py-1.5 uppercase rounded-sm border cursor-pointer transition-all ${
                              product.outOfStock
                                ? "border-amber-900/50 bg-amber-950/20 text-amber-500 hover:bg-amber-900/20"
                                : "border-emerald-900/30 bg-emerald-950/10 text-emerald-500 hover:bg-emerald-950/15"
                            }`}
                            title={product.outOfStock ? "Reinstate back-in-stock immediately" : "Flag as temporarily out of stock"}
                          >
                            {product.outOfStock ? "🛋️ Out of Stock" : "🔥 In Stock"}
                          </button>

                          <button
                            id={`delete-product-${product.id}`}
                            onClick={() => {
                              if (confirm(`Are you certain you want to remove "${product.name}" from the active store?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="border border-zinc-900 hover:border-red-900/30 bg-zinc-950 p-2 text-zinc-450 hover:text-red-400 hover:bg-red-950/10 rounded cursor-pointer transition-colors"
                            title="Decommission drop immediately"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Interactive size-stock inline editor */}
                      <div className="border-t border-zinc-900/50 pt-2.5">
                        <button
                          id={`edit-stock-toggle-${product.id}`}
                          onClick={() => {
                            if (editingStockProductId === product.id) {
                              setEditingStockProductId(null);
                            } else {
                              setEditingStockProductId(product.id);
                              const initStock: Record<string, number> = {};
                              product.sizes.forEach((s) => {
                                initStock[String(s)] = sizeStock[String(s)] ?? 5;
                              });
                              setTempStockMap(initStock);
                            }
                          }}
                          className={`w-full text-center py-1.5 font-mono text-[9px] uppercase tracking-wider border rounded transition-all cursor-pointer ${
                            editingStockProductId === product.id
                              ? "bg-zinc-900 border-zinc-800 text-[#C9A84C]"
                              : "bg-zinc-950/40 border-zinc-900/80 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
                          }`}
                        >
                          {editingStockProductId === product.id ? "Close Restock Panel" : "⚙️ Modify Size Stock Quantities"}
                        </button>

                        {editingStockProductId === product.id && (
                          <div className="mt-3 p-3 bg-zinc-900/20 border border-zinc-900 rounded space-y-3 animate-reveal">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[8px] uppercase text-[#C9A84C] font-semibold">Restock quantities allocation</span>
                              <span className="font-mono text-[7px] text-zinc-500 uppercase">Save to write to live drop</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {product.sizes.map((s) => {
                                const qty = tempStockMap[String(s)] ?? 0;
                                return (
                                  <div key={s} className="flex flex-col items-center bg-zinc-950 border border-zinc-900 p-1.5 rounded">
                                    <span className="font-mono text-[8.5px] text-zinc-400">EUR {s}</span>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <button
                                        id={`dec-stock-${product.id}-${s}`}
                                        type="button"
                                        onClick={() => {
                                          setTempStockMap((prev) => ({
                                            ...prev,
                                            [String(s)]: Math.max(0, qty - 1)
                                          }));
                                        }}
                                        className="w-5 h-5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded text-[10px] leading-none flex items-center justify-center cursor-pointer select-none"
                                      >
                                        -
                                      </button>
                                      <span className="font-mono text-[10px] text-white min-w-[20px] text-center font-bold">
                                        {qty}
                                      </span>
                                      <button
                                        id={`inc-stock-${product.id}-${s}`}
                                        type="button"
                                        onClick={() => {
                                          setTempStockMap((prev) => ({
                                            ...prev,
                                            [String(s)]: qty + 1
                                          }));
                                        }}
                                        className="w-5 h-5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-[#C9A84C] rounded text-[10px] leading-none flex items-center justify-center cursor-pointer select-none font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <button
                              id={`save-stock-btn-${product.id}`}
                              type="button"
                              onClick={async () => {
                                await updateProductStock(product.id, tempStockMap);
                                setEditingStockProductId(null);
                              }}
                              className="w-full bg-[#C9A84C]/90 hover:bg-[#C9A84C] text-black font-mono text-[9px] uppercase tracking-wider font-extrabold py-2 rounded transition-all text-center cursor-pointer"
                            >
                              Save Sneaker Restock Level
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "stock-alerts" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <div>
                  <h4 className="font-display font-black text-lg text-white uppercase">STOCK ALERT REQUESTS ({notifications.length})</h4>
                  <p className="font-sans text-xs text-zinc-400 font-normal">
                    Real-time sneaker notification requests submitted by visitors. Re-stocking these products alerts the clients.
                  </p>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div id="no-notifications-alert" className="border border-dashed border-zinc-900 py-12 text-center text-zinc-500 rounded">
                  <Bell size={24} className="mx-auto mb-2 text-zinc-700" />
                  <p className="font-mono text-[10px] uppercase tracking-wider">No pending restock notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className="border border-zinc-900 bg-zinc-950 p-4 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans animate-reveal"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] bg-[#C9A84C]/10 text-[#C9A84C] px-1.5 py-0.5 rounded font-black tracking-wider border border-[#C9A84C]/25">
                            SIZE: {notif.size || "Any"}
                          </span>
                          <span className="font-mono text-[8.5px] text-zinc-500">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-white">
                          Requested item: <span className="text-[#C9A84C]">{notif.productName}</span>
                        </h5>
                        <p className="text-[#C9A84C] font-mono text-[11px] font-medium hover:underline flex items-center gap-1">
                          <Mail size={10} />
                          <span>{notif.userEmail}</span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          id={`email-notif-client-${notif.id}`}
                          href={`mailto:${notif.userEmail}?subject=SoleBox restock on ${encodeURIComponent(notif.productName)}!&body=Hi there,%0A%0AWe are writing to notify you that the ${encodeURIComponent(notif.productName)} in size ${notif.size} is now back in stock!%0A%0AOrder here: https://solebox-lk.com%0A%0ABest regards,%0AThe SoleBox LK Team`}
                          className="px-3.5 py-2 bg-[#C9A84C] hover:bg-[#b0913c] text-black font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-sm transition-all text-center"
                        >
                          Email Alert
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
