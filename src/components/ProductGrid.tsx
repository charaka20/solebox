import { useState } from "react";
import { MessageSquare, ShoppingCart, Check, Info, ArrowUpRight } from "lucide-react";
import { Product } from "../types";
import { useApp } from "../context/AppContext";

export default function ProductGrid() {
  const { products, addToCart } = useApp();
  
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [addedProductKeys, setAddedProductKeys] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 scroll-mt-20">
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
                  ? "bg-[#1a1814] text-white border-[#1a1814] font-bold"
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
            const key = `${product.id}-${selectedSize}`;
            const addedStatus = addedProductKeys[key];

            return (
              <div
                id={`product-card-${product.id}`}
                key={product.id}
                className="group relative bg-[#FBF9F6] border border-[#e4e0da] rounded-sm overflow-hidden flex flex-col hover:border-zinc-400 transition-all hover:shadow-md animate-reveal"
              >
                {/* Brand watermark and custom badges */}
                <div className="absolute top-3.5 left-3.5 z-20 flex gap-1.5">
                  <span className="bg-[#1a1814] px-2.5 py-1 text-[8px] font-mono font-black text-[#F7F4EE] tracking-wider rounded-sm uppercase">
                    {product.brand}
                  </span>
                  {product.isCustomImport && (
                    <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2.5 py-1 text-[8px] font-mono font-black text-[#C9A84C] tracking-wider rounded-sm uppercase">
                      Custom Import
                    </span>
                  )}
                </div>

                {/* Product picture rendering */}
                <div className="relative aspect-square w-full bg-[#f1eeef] overflow-hidden border-b border-[#e4e0da]">
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
                      <span className="font-mono text-zinc-400 text-[10px] tracking-wideruppercase">AUTHENTIC DROP</span>
                      <span className="font-display font-medium text-[#C9A84C] text-sm sm:text-base">Rs. {product.price.toLocaleString()}</span>
                    </div>

                    {/* Sizes selection widget */}
                    <div className="pt-2">
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Select EUR Size:</div>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => (
                          <button
                            id={`size-${product.id}-${size}`}
                            key={size}
                            onClick={() => handleSizeChange(product.id, size)}
                            className={`min-w-[34px] p-1.5 text-[10px] font-mono border rounded-sm select-none cursor-pointer transition-all ${
                              selectedSize === size
                                ? "bg-[#1a1814] text-[#F7F4EE] border-[#1a1814] font-black"
                                : "bg-white text-zinc-650 border-[#e4e0da] hover:border-zinc-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order / Add buttons */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      id={`add-to-cart-btn-${product.id}`}
                      onClick={() => {
                        addToCart(product, selectedSize);
                        setAddedProductKeys((prev) => ({ ...prev, [key]: true }));
                        setTimeout(() => {
                           setAddedProductKeys((prev) => ({ ...prev, [key]: false }));
                        }, 1800);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#1a1814] hover:bg-zinc-800 text-white font-mono font-bold text-xs tracking-wider py-3 rounded-sm transition-all cursor-pointer shadow-sm select-none"
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
                      className="w-full flex items-center justify-center gap-1.5 bg-[#C9A84C] hover:bg-[#b0913c] text-[#1a1814] font-mono font-black text-xs tracking-wider py-3 rounded-sm  transition-all text-center shadow-sm"
                    >
                      <MessageSquare size={13} />
                      <span>ORDER VIA WHATSAPP</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                  className="w-full h-full object-cover"
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
    </section>
  );
}
