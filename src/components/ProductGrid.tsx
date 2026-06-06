import { useState } from "react";
import { MessageSquare, ShoppingCart, Check, Info, ArrowUpRight, Bell, Mail } from "lucide-react";
import { Product } from "../types";
import { useApp } from "../context/AppContext";

export default function ProductGrid() {
  const { products, addToCart, subscribeToStockAlert, currentUser } = useApp();
  
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [addedProductKeys, setAddedProductKeys] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Notify Me Subscription state
  const [notifyProduct, setNotifyProduct] = useState<{ product: Product; size: number } | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState("");

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyProduct) return;
    if (!notifyEmail.trim() || !notifyEmail.includes("@")) {
      setNotifyError("Please present a valid recipient email address.");
      return;
    }

    try {
      setIsSubmittingNotify(true);
      setNotifyError("");
      await subscribeToStockAlert(
        notifyProduct.product.id,
        notifyProduct.product.name,
        notifyEmail.trim(),
        notifyProduct.size
      );
      setNotifySuccess(true);
      setTimeout(() => {
        setNotifyProduct(null);
        setNotifySuccess(false);
      }, 3000);
    } catch (err: any) {
      setNotifyError(err?.message || "Something went wrong registering subscription.");
    } finally {
      setIsSubmittingNotify(false);
    }
  };

  // Extract unique brands dynamically
  const brands = ["All Brands", ...Array.from(new Set(products.map((p) => p.brand)))];

  const filteredProducts = products.filter(
    (product) => selectedBrand === "All Brands" || product.brand === selectedBrand
  );

  const handleSizeChange = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const getWhatsAppLink = (product: Product, size: number) => {
    const text = `Hi SoleBox LK! I would like to order:
👟 Sneaker: ${product.name} (${product.brand})
📏 Selected Size: EUR ${size}
🏷️ Price: LKR ${product.price.toLocaleString()}
🚚 Payment Mode: Cash On Delivery

Please complete my order placement!`;
    return `https://wa.me/94722401093?text=${encodeURIComponent(text)}`; // Real curated premium Sri Lankan helpline number format
  };

  return (
    <section id="shop" className="w-full bg-[#F5F0E6] py-16 scroll-mt-20 border-t border-b border-[#e4e0da]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Grid Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-[#e4e0da] pb-6">
          <div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#C9A84C] uppercase font-bold mb-1.5 flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              Latest Drops
            </div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-[#1a1814] uppercase">THE CURRENT COLLECTION</h2>
          </div>

          {/* Filter selectors */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {brands.map((brand) => (
              <button
                id={`filter-${brand.toLowerCase().replace(/\s+/g, "-")}`}
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`text-xs font-mono py-2 px-4 rounded-sm border cursor-pointer select-none uppercase tracking-wider transition-all duration-300 ${
                  selectedBrand === brand
                    ? "bg-[#1A1712] text-white border-[#1A1712] font-bold"
                    : "bg-white text-zinc-650 border-[#e4e0da] hover:border-zinc-400 hover:text-black"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Showcase */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 border border-dashed border-[#e4e0da] bg-white/50 rounded-sm">
            <p className="font-mono text-sm uppercase">No shoes found under this brand cluster.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const selectedSize = selectedSizes[product.id] || product.sizes[0];
              const sizeStock = product.sizeStock?.[String(selectedSize)];
              const isSizeOutOfStock = sizeStock !== undefined && sizeStock === 0;
              const isProductOrSizeOutOfStock = product.outOfStock || isSizeOutOfStock;
              const key = `${product.id}-${selectedSize}`;
              const addedStatus = addedProductKeys[key];

              return (
                <div
                  id={`product-card-${product.id}`}
                  key={product.id}
                  className="group relative bg-[#FDFCFB] border border-[#e4e0da] rounded-none overflow-hidden flex flex-col hover:border-zinc-400 transition-all hover:shadow-md animate-reveal"
                >
                  {/* Brand watermark and custom badges */}
                  <div className="absolute top-3.5 left-3.5 z-20 flex gap-1.5">
                    <span className="bg-[#1A1712] px-2.5 py-1 text-[8px] font-mono font-black text-[#F7F4EE] tracking-wider rounded-sm uppercase">
                      {product.brand}
                    </span>
                    {product.isCustomImport && (
                      <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2.5 py-1 text-[8px] font-mono font-black text-[#C9A84C] tracking-wider rounded-sm uppercase">
                        Custom Import
                      </span>
                    )}
                  </div>

                  {/* Product picture rendering on parchment #EDE8DE */}
                  <div className="relative aspect-square w-full bg-[#EDE8DE] overflow-hidden border-b border-[#e4e0da]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Micro Info Trigger */}
                    <button
                      id={`info-trigger-${product.id}`}
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-sm cursor-pointer border border-[#e4e0da] text-zinc-700 hover:text-[#C9A84C] transition-all"
                      title="Sneaker Specifications"
                    >
                      <Info size={14} />
                    </button>
                  </div>

                  {/* Core descriptions */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-sans font-bold text-sm text-[#1a1814] line-clamp-1" title={product.name}>
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-zinc-400 text-[10px] tracking-wider uppercase">AUTHENTIC DROP</span>
                        <span className="font-display font-medium text-[#C9A84C] text-sm sm:text-base">Rs. {product.price.toLocaleString()}</span>
                      </div>

                      {/* Sizes selection widget */}
                      <div className="pt-2">
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Select EUR Size:</div>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size) => {
                            const specificStock = product.sizeStock?.[String(size)];
                            const isOos = specificStock !== undefined && specificStock === 0;
                            return (
                              <button
                                id={`size-${product.id}-${size}`}
                                key={size}
                                onClick={() => handleSizeChange(product.id, size)}
                                className={`min-w-[34px] p-1.5 text-[10px] font-mono border rounded-sm select-none cursor-pointer transition-all relative ${
                                  selectedSize === size
                                    ? "bg-[#1A1712] text-[#F7F4EE] border-[#1A1712] font-black"
                                    : isOos
                                      ? "bg-zinc-100 text-zinc-300 border-zinc-200 line-through cursor-not-allowed opacity-50"
                                      : "bg-white text-zinc-650 border-[#e4e0da] hover:border-zinc-400"
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Order / Add buttons */}
                    <div className="space-y-1.5 pt-1">
                      {isProductOrSizeOutOfStock ? (
                        <div className="space-y-1.5">
                          <div className="bg-amber-50 text-[#C9A84C] border border-[#C9A84C]/30 font-mono text-[9px] uppercase tracking-widest text-center py-2.5 rounded-sm font-black">
                            🛡️ SIZE EUR {selectedSize} OUT OF STOCK
                          </div>
                          <button
                            id={`notify-me-trigger-${product.id}`}
                            onClick={() => {
                              setNotifyProduct({ product, size: selectedSize });
                              setNotifyEmail(currentUser?.email || "");
                              setNotifySuccess(false);
                              setNotifyError("");
                            }}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#1A1712] hover:bg-[#C9A84C] hover:text-black text-[#F7F4EE] font-mono font-bold text-xs tracking-wider py-3 rounded-sm transition-all cursor-pointer shadow-sm select-none uppercase"
                          >
                            <Bell size={13} className="animate-pulse" />
                            <span>NOTIFY ME ON RESTOCK</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            id={`add-to-cart-btn-${product.id}`}
                            onClick={() => {
                              addToCart(product, selectedSize);
                              setAddedProductKeys((prev) => ({ ...prev, [key]: true }));
                              setTimeout(() => {
                                 setAddedProductKeys((prev) => ({ ...prev, [key]: false }));
                              }, 1800);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#1A1712] hover:bg-zinc-800 text-white font-mono font-bold text-xs tracking-wider py-3 rounded-sm transition-all cursor-pointer shadow-sm select-none"
                          >
                            {addedStatus ? (
                              <>
                                <Check size={13} className="animate-reveal text-[#C9A84C]" />
                                <span className="text-[#C9A84C]">ADDED TO BASKET!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={13} />
                                <span>ADD TO ACCUMULATOR</span>
                              </>
                            )}
                          </button>

                          <a
                            id={`whatsapp-concierge-${product.id}`}
                            href={getWhatsAppLink(product, selectedSize)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 bg-[#C9A84C] hover:bg-[#b0913c] text-[#1A1712] font-mono font-black text-xs tracking-wider py-3 rounded-sm  transition-all text-center shadow-sm"
                          >
                            <MessageSquare size={13} />
                            <span>ORDER VIA WHATSAPP</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick view specification modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-reveal">
          <div className="w-full max-w-lg bg-[#F7F4EE] border border-[#e4e0da] p-6 sm:p-8 rounded-sm relative shadow-2xl">
            <button
              id="close-quickview-btn"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-black cursor-pointer bg-white border border-[#e4e0da] p-1 rounded"
            >
              <ArrowUpRight size={18} className="rotate-45" />
            </button>

            <div className="space-y-4">
              <div className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] font-mono text-[9px] font-bold py-1 px-2 rounded border border-[#C9A84C]/25 uppercase mb-1">
                {quickViewProduct.brand} Curated Import
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-none">
                {quickViewProduct.name}
              </h3>
              
              <div className="aspect-video w-full overflow-hidden rounded bg-zinc-900 border border-zinc-900">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover animate-reveal"
                />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider">Specifications Overview</div>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed font-normal">
                  {quickViewProduct.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-900 font-mono text-xs">
                <span className="text-zinc-500">Authenticity Guarantee</span>
                <span className="text-[#C9A84C] font-bold">100% Factory Seal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notify Me Back-in-Stock subscription Modal */}
      {notifyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-reveal">
          <div className="w-full max-w-md bg-[#FBF9F6] border border-[#e4e0da] p-6 sm:p-8 rounded shadow-2xl relative animate-reveal text-[#1A1712]">
            <button
               id="close-notify-btn"
              onClick={() => setNotifyProduct(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-black cursor-pointer bg-white border border-[#e4e0da] p-1.5 rounded"
            >
              <ArrowUpRight size={16} className="rotate-45" />
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[#C9A84C] font-mono text-[9px] font-black uppercase tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2.5 py-1 rounded-sm">
                <Bell size={11} className="animate-bounce" />
                <span>RESTOCK NOTIFICATION REQUEST</span>
              </div>
              <h3 className="font-display font-medium text-lg sm:text-xl text-[#1A1712] uppercase leading-tight tracking-tight">
                {notifyProduct.product.name}
              </h3>
              <p className="font-sans text-xs text-zinc-600 font-normal leading-relaxed">
                You are subscribing to stock notifications for EUR size <strong className="font-mono bg-white text-zinc-800 border border-[#e4e0da] px-1.5 py-0.5 rounded text-[11px]">EUR {notifyProduct.size}</strong>. We'll automatically shoot you a priority email alert the instance this sneaker is back in stock.
              </p>

              {notifySuccess ? (
                <div id="notify-success-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-4 px-4 rounded space-y-1.5 animate-reveal text-center">
                  <p className="font-mono font-black uppercase tracking-wider">✨ SUBSCRIPTION SUCCESSFUL!</p>
                  <p className="font-sans text-emerald-950">We registered your email for size {notifyProduct.size} updates.</p>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="space-y-4">
                  {notifyError && (
                    <p id="notify-error-msg" className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono uppercase px-3 py-2 rounded">
                      ⚠️ {notifyError}
                    </p>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest font-black">ENTER YOUR EMAIL</label>
                    <div className="relative">
                      <input
                        id="notify-email-input"
                        type="email"
                        required
                        placeholder="e.g. customer@example.com"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="w-full bg-white border border-[#e4e0da] focus:border-[#1A1712] outline-none text-xs text-[#1A1712] py-3.5 pl-10 pr-4 rounded font-sans"
                        disabled={isSubmittingNotify}
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                        <Mail size={13} />
                      </span>
                    </div>
                  </div>

                  <button
                    id="notify-submit-btn"
                    type="submit"
                    disabled={isSubmittingNotify}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#1A1712] hover:bg-zinc-800 disabled:bg-zinc-300 text-[#F7F4EE] disabled:text-zinc-500 font-mono font-bold text-xs tracking-wider py-3.5 rounded transition-all cursor-pointer select-none uppercase shadow-sm"
                  >
                    <span>{isSubmittingNotify ? "TRANSMITTING REQUEST..." : "SUBMIT PREFERENCE"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
