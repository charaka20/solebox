import { ArrowDown, MessageSquare } from "lucide-react";

interface HeroProps {
  onScrollClick: () => void;
}

export default function Hero({ onScrollClick }: HeroProps) {
  return (
    <div>
      <section className="relative bg-[#1A1712] pt-12 sm:pt-16 pb-12 px-4 sm:px-6 md:px-8 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[460px] md:min-h-[520px]">
            {/* Left Content Column */}
            <div className="flex flex-col justify-center py-8 sm:py-12 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#C9A84C]">
                <span className="h-0.5 w-6 bg-[#C9A84C]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-black">Premium Footwear. Smart Price.</span>
              </div>

              {/* Display Typography */}
              <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]">
                No roads.<br />
                No limits.<br />
                <span className="font-serif italic text-[#C9A84C]">Just you.</span>
              </h1>

              <p className="max-w-md font-sans text-zinc-350 leading-relaxed text-sm sm:text-base font-normal">
                Export quality sport sneakers. Every pair handpicked for active lifestyles in Sri Lanka. Delivered safely island-wide via trustable cash-on-delivery service.
              </p>

              {/* Grand, Pinned Above-The-Fold Gold WhatsApp CTA */}
              <div className="pt-4 space-y-3">
                <a
                  id="hero-whatsapp-order-btn"
                  href="https://wa.me/94722401093?text=Hi%20SoleBox%20LK!%20I%20would%20like%20to%20explore%20your%20premium%20sneaker%20collection%20and%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#C9A84C] hover:bg-[#b0913c] text-black font-mono font-black tracking-[0.2em] text-xs uppercase py-4 px-6 rounded-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] duration-150 cursor-pointer text-center"
                >
                  <MessageSquare size={14} className="fill-current text-black animate-pulse" />
                  <span>Order via WhatsApp</span>
                </a>
                
                {/* Secondary Collection Scroller */}
                <button
                  id="hero-shop-scroller"
                  onClick={onScrollClick}
                  className="w-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 font-mono font-bold tracking-widest text-[10px] uppercase py-3 rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore core drops collection</span>
                  <ArrowDown size={11} className="animate-bounce" />
                </button>
              </div>
            </div>

            {/* Right Graphic/Mock Column */}
            <div className="flex items-center justify-center py-6 sm:py-8 md:py-12">
              <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] bg-[#ece9e2] rounded-xl flex items-center justify-center overflow-hidden border border-[#C9A84C]/10 shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                
                {/* Premium Curated Active Drop Image */}
                <img
                  src="/images/4.png"
                  alt="Curated Series S1 - Featured Yeezy Boost Onyx"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Premium gradient overlay for readability and text protection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 z-10 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] font-black animate-pulse">
                    Curated Series S1
                  </span>
                  <h3 className="font-display font-medium text-white text-base sm:text-lg tracking-tight uppercase mt-1 drop-shadow-sm">
                    Yeezy Boost 350 V2 "Onyx"
                  </h3>
                </div>

                <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#1A1712] font-mono font-black text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-sm select-none z-10">
                  New drop
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Trust Bar directly under the hero */}
      <div className="bg-[#C9A84C] text-[10.5px] sm:text-xs font-mono font-black text-black uppercase tracking-widest py-3 pb-3.5 px-4 text-center border-b border-[#C9A84C]/25 shadow-sm flex flex-col sm:flex-row justify-center items-center gap-1.5 sm:gap-8 leading-none select-none">
        <span className="flex items-center gap-1.5">🚚 Island-wide Delivery</span>
        <span className="hidden sm:inline text-black/30 font-normal">·</span>
        <span className="flex items-center gap-1.5">💵 Cash on Delivery</span>
        <span className="hidden sm:inline text-black/30 font-normal">·</span>
        <span className="flex items-center gap-1.5">✓ Quality Assured</span>
      </div>

      {/* EU 39-45 . Rs. 17,990 stats row under the gold trust bar */}
      <div className="bg-[#1A1712] border-b border-[#C9A84C]/10 py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#C9A84C]/15">
          <div className="flex flex-col items-center justify-center p-1 md:first:border-none">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-zinc-500 font-bold">EU SIZE SPECIFICATION</span>
            <span className="font-display font-bold text-white text-base sm:text-lg mt-1 tracking-wider">39 — 45 Range</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 pt-4 md:pt-1">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-zinc-500 font-bold">FLAT-RATE PRICING</span>
            <span className="font-display font-black text-[#C9A84C] text-lg sm:text-xl mt-0.5">Rs. 17,990 Net</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 pt-4 md:pt-1">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-zinc-500 font-bold">LOCAL EXPEDITION</span>
            <span className="font-display font-medium text-white text-sm sm:text-base mt-1 uppercase tracking-wide">Domex & Pronto</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 pt-4 md:pt-1">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#C9A84C] font-bold">SECURITY CLAUSE</span>
            <span className="font-display font-black text-[#C9A84C] text-sm sm:text-base mt-1 uppercase tracking-wide">100% COD Guarantee</span>
          </div>
        </div>
      </div>

      {/* Premium Scrolling Ticker / Marquee bar (Looping CSS) */}
      <div className="relative py-3.5 bg-[#1A1712] overflow-hidden whitespace-nowrap border-b border-[#C9A84C]/10 select-none">
        <div className="inline-block animate-[scroll_24s_linear_infinite] whitespace-nowrap flex gap-8 font-mono text-[10px] tracking-[0.25em] text-[#C9A84C] uppercase font-black">
          <span>Premium Imported</span>
          <span>·</span>
          <span>Export Quality</span>
          <span>·</span>
          <span>Island-wide Delivery</span>
          <span>·</span>
          <span>Cash on Delivery</span>
          <span>·</span>
          <span>EU Sizes 39–45</span>
          <span>·</span>
          <span>Uniform Price Rs. 17,990</span>
          <span>·</span>
          <span>Premium Imported</span>
          <span>·</span>
          <span>Export Quality</span>
          <span>·</span>
          <span>Island-wide Delivery</span>
          <span>·</span>
          <span>Cash on Delivery</span>
          <span>·</span>
          <span>EU Sizes 39–45</span>
          <span>·</span>
          <span>Uniform Price Rs. 17,990</span>
        </div>
      </div>
    </div>
  );
}
