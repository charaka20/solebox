import { Star, Verified } from "lucide-react";

export default function Reviews() {
  const customerReviews = [
    {
      name: "Amith Jayasinghe",
      city: "Colombo",
      comment: "Absolutely pristine Travis Scotts. The custom parcel packaging arrived sealed and the authenticity check cleared. Highly recommended imports curating!",
      rating: 5,
    },
    {
      name: "Shehan Fonseka",
      city: "Kandy",
      comment: "Insanely fast cash-on-delivery turnaround. Ordered NB 550s yesterday, they arrived today in Hanthana with tracking. Truly premium.",
      rating: 5,
    },
    {
      name: "Naduni Pieris",
      city: "Nugegoda",
      comment: "I was highly skeptical at first, but SoleBox LK has proved that their direct importing sequence works. Spotless Dunk Lows custom shipped.",
      rating: 5,
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 border-t border-[#e4e0da]">
      
      {/* Title */}
      <div className="mb-10 text-center space-y-2">
        <div className="text-[10px] font-mono tracking-[0.25em] text-[#C9A84C] uppercase font-bold">REAL BUYERS</div>
        <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#1a1814] uppercase tracking-tight">What Sri Lanka is saying</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerReviews.map((rev, index) => (
          <div key={index} className="bg-[#FBF9F6] border border-[#e4e0da] p-6 rounded-sm space-y-4 hover:border-zinc-400 transition-colors flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex gap-0.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={11} className="fill-current text-[#C9A84C]" />
                ))}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#6b6860] italic leading-relaxed font-normal">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#e4e0da]/70">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-xs font-bold text-[#1a1814]">{rev.name}</span>
                <span className="font-mono text-[9px] text-[#C9A84C] uppercase">{rev.city}</span>
              </div>
              <Verified size={12} className="text-[#C9A84C]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
