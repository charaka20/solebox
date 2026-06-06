import { useState } from "react";
import { Instagram, Heart } from "lucide-react";

interface UGCPhoto {
  id: number;
  url: string;
  handle: string;
  likes: number;
  text: string;
}

export default function UGCStrip() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const photos: UGCPhoto[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop",
      handle: "@amith.jay",
      likes: 124,
      text: "Unpacking the new drops. Perfection. 👟"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      handle: "@kaushalya_r",
      likes: 89,
      text: "First walk around Colombo in these. Comfort levels 100!"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
      handle: "@sahan_lk",
      likes: 156,
      text: "Secured. Best service in town hands down."
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
      handle: "@dilshan.p",
      likes: 213,
      text: "Stitching is flawless. Flat-rate pricing is insane."
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
      handle: "@shehara_fdo",
      likes: 72,
      text: "Minimalist runner aesthetic. Absolute love."
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
      handle: "@danush_k",
      likes: 144,
      text: "Always on point. Highly recommended @soleboxlk 💯"
    }
  ];

  return (
    <section className="bg-[#1A1712] py-16 px-4 border-t border-b border-black">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-3 text-[10px] font-mono tracking-widest text-[#C9A84C] uppercase font-bold">
          <Instagram size={12} />
          <span>ON THE STREETS</span>
        </div>
        <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#F7F4EE] uppercase tracking-tight">
          #SoleBoxStyle
        </h3>
        <p className="font-mono text-[9px] sm:text-xs tracking-widest text-zinc-400 mt-2 uppercase">
          Tag <span className="text-[#C9A84C] font-semibold">@soleboxlk</span> on Instagram to get featured with your pair
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-7xl mx-auto">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square overflow-hidden bg-zinc-900 border border-zinc-800 rounded-lg cursor-pointer transition-all duration-300 shadow-lg"
            onMouseEnter={() => setHoveredId(photo.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image */}
            <img
              src={photo.url}
              alt={`Lifestyle unboxing photo of shoe by ${photo.handle}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Premium Instagram Tint Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4" />

            {/* Hover details */}
            <div className={`absolute inset-0 flex flex-col justify-between p-3.5 transition-all duration-300 ${
              hoveredId === photo.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
            }`}>
              <div className="flex items-center justify-between text-[#F7F4EE]">
                <span className="font-mono text-[10px] sm:text-xs tracking-wider text-[#C9A84C] font-bold">
                  {photo.handle}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400">
                  <Heart size={10} className="fill-current text-red-500" />
                  {photo.likes}
                </span>
              </div>
              <p className="text-[10px] text-zinc-200 font-sans line-clamp-2 leading-relaxed tracking-wide italic">
                "{photo.text}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
