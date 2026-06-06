export default function TrustSection() {
  return (
    <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 scroll-mt-20">
      <div className="bg-[#1a1814] text-[#F7F4EE] rounded-sm p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-12 border border-[#C9A84C]/10 shadow-lg">
        
        {/* Left story content column */}
        <div className="space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 text-[#C9A84C]">
            <span className="h-0.5 w-6 bg-[#C9A84C]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">The SoleBox philosophy</span>
          </div>
          
          <h3 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Freedom is a<br />
            feeling. <span className="font-serif italic text-[#C9A84C]">Wear it.</span>
          </h3>
          
          <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            We believe premium footwear shouldn't be locked behind hyper-inflated import prices or city showroom markups. Every pair we import is hand-selected — tailored for real movement, real roads, and real people across Sri Lanka.
          </p>

          <button
            onClick={() => {
              const el = document.getElementById("shop");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 bg-[#C9A84C] hover:bg-[#b0913c] text-[#1a1814] font-mono font-bold tracking-widest text-[10px] uppercase rounded-sm transition-all cursor-pointer shadow-sm select-none"
          >
            Explore drops
          </button>
        </div>

        {/* Right metrics facts column */}
        <div className="w-full md:w-auto flex-1 md:max-w-md space-y-4">
          <div className="flex flex-col gap-1 border-b border-[#2e2c28] pb-4">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Sizes stocked</span>
            <div className="flex items-baseline justify-between select-none">
              <span className="font-display font-bold text-lg sm:text-2xl text-[#f7f4ee]">EU 39–45</span>
              <span className="text-[10px] font-mono text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm">COMPREHENSIVE</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b border-[#2e2c28] pb-4">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Pricing cluster</span>
            <div className="flex items-baseline justify-between select-none">
              <span className="font-display font-bold text-lg sm:text-2xl text-[#f7f4ee]">Rs. 17,990</span>
              <span className="text-[10px] font-mono text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm">FIXED FLAT RATE</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b border-[#2e2c28] pb-4">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Island dispatch</span>
            <div className="flex items-baseline justify-between select-none">
              <span className="font-display font-bold text-lg sm:text-2xl text-[#f7f4ee]">Island-wide</span>
              <span className="text-[10px] font-mono text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm">DOMEX & PRONTO</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-[#2e2c28] pb-1">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Payment mode</span>
            <div className="flex items-baseline justify-between select-none">
              <span className="font-display font-bold text-lg sm:text-2xl text-[#f7f4ee]">Cash on Delivery</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm font-bold">100% SECURE</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
