import { ArrowDown } from "lucide-react";

interface HeroProps {
  onScrollClick: () => void;
}

export default function Hero({ onScrollClick }: HeroProps) {
  return (
    <div>
      <section className="relative bg-[#F4F1EA] pt-12 sm:pt-16 pb-0 px-4 sm:px-6 md:px-8 overflow-hidden border-b border-[#e4e0da]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch min-h-[440px]">
            {/* Left Content Column */}
            <div className="flex flex-col justify-center py-6 sm:py-12 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#C9A84C]">
                <span className="h-0.5 w-6 bg-[#C9A84C]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Premium Footwear</span>
              </div>

              {/* Display Typography */}
              <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#1a1814] leading-[1.05]">
                No roads.<br />
                No limits.<br />
                <span className="font-serif italic text-[#C9A84C]">Just you.</span>
              </h1>

              <p className="max-w-md font-sans text-[#6b6860] leading-relaxed text-sm sm:text-base font-normal">
                Export quality sport sneakers. Every pair handpicked for active lifestyles in Sri Lanka. Delivered safely island-wide via trustable cash-on-delivery service.
              </p>

              {/* Precise action handlers */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  id="hero-explore-btn"
                  onClick={onScrollClick}
                  className="px-6 py-3.5 bg-[#1a1814] hover:bg-zinc-800 text-[#F7F4EE] font-mono font-bold tracking-widest text-xs uppercase rounded-sm transition-all cursor-pointer select-none active:scale-95 shadow-md flex items-center gap-2"
                >
                  <span>Shop core collection</span>
                  <ArrowDown size={13} />
                </button>
                
                <button
                  id="hero-story-scroller"
                  onClick={() => {
                    const el = document.getElementById("philosophy");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3.5 bg-transparent hover:bg-zinc-100 text-[#1a1814] border border-[#1a1814] font-mono font-bold tracking-widest text-xs uppercase rounded-sm transition-all cursor-pointer select-none"
                >
                  See elements
                </button>
              </div>
            </div>

            {/* Right Graphic/Mock Column */}
            <div className="flex items-end justify-center pt-8 md:pt-16">
              <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] bg-[#ece9e2] rounded-t-lg flex items-center justify-center overflow-hidden border border-[#e4e0da] border-b-0 shadow-sm group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                
                {/* Premium Curated Active Drop Image */}
                <img
                  src="/images/4.png"
                  alt="Curated Series S1 - Featured Yeezy Boost Onyx"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Premium gradient overlay for readability and text protection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 z-10 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] font-black">
                    Curated Series S1
                  </span>
                  <h3 className="font-display font-medium text-white text-base sm:text-lg tracking-tight uppercase mt-1 drop-shadow-sm">
                    Yeezy Boost 350 V2 "Onyx"
                  </h3>
                </div>

                <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#1a1814] font-mono font-black text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-sm select-none z-10">
                  New drop
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Scrolling Ticker / Marquee bar (Looping CSS) */}
      <div className="relative py-3.5 bg-[#1a1814] overflow-hidden whitespace-nowrap border-b border-[#C9A84C]/20 select-none">
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
