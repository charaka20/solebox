import { Truck, HelpCircle, ShieldCheck, MessageSquare, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const handleScrollToGrid = () => {
    const el = document.getElementById("shop");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const text = `Hi SoleBox LK! I would like to explore your premium sneaker collection and confirm an order.`;
  const whatsappLink = `https://wa.me/94722401093?text=${encodeURIComponent(text)}`;

  return (
    <div className="w-full">
      {/* 1. Delivery Strip Component */}
      <section id="delivery" className="border-t border-b border-[#e4e0da] bg-white divide-y md:divide-y-0 md:divide-x divide-[#e4e0da] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 scroll-mt-20">
        <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center">
          <Truck size={24} className="text-[#C9A84C]" />
          <div className="font-sans font-bold text-xs tracking-wider text-[#1a1814] uppercase">Island-wide delivery</div>
          <p className="font-sans text-[11px] text-zinc-500">Secure dispatch via Domex & Pronto</p>
        </div>

        <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center">
          <MessageSquare size={24} className="text-[#C9A84C]" />
          <div className="font-sans font-bold text-xs tracking-wider text-[#1a1814] uppercase">Cash on delivery</div>
          <p className="font-sans text-[11px] text-zinc-500">Pay inside Sri Lanka upon arrival</p>
        </div>

        <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center">
          <ShieldCheck size={24} className="text-[#C9A84C]" />
          <div className="font-sans font-bold text-xs tracking-wider text-[#1a1814] uppercase">Quality assured</div>
          <p className="font-sans text-[11px] text-zinc-500">Every single pair physically checked</p>
        </div>

        <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center">
          <HelpCircle size={24} className="text-[#C9A84C]" />
          <div className="font-sans font-bold text-xs tracking-wider text-[#1a1814] uppercase">WhatsApp orders</div>
          <p className="font-sans text-[11px] text-zinc-500">Helpdesk agent reply in minutes</p>
        </div>
      </section>

      {/* 2. Final Golden Call To Action Banner */}
      <section className="bg-[#C9A84C] text-[#1a1814] py-16 px-4 text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-[#6b4e10]">READY TO MOVE?</div>
          <h3 className="font-display font-medium text-3xl sm:text-4xl tracking-tight uppercase leading-none font-bold">Your next pair is waiting.</h3>
          <p className="font-sans text-[#6b4e10] text-xs sm:text-sm font-normal">
            Message us directly. Orders confirmed in minutes. Delivered right to your front door. Uniform island pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#1a1814] hover:bg-zinc-850 text-white font-mono font-bold tracking-widest text-xs uppercase rounded-sm transition-all shadow-md inline-flex items-center gap-2"
          >
            <MessageSquare size={14} />
            <span>Order on WhatsApp</span>
          </a>

          <button
            onClick={handleScrollToGrid}
            className="px-6 py-3.5 bg-transparent hover:bg-[#1a1814]/10 text-[#1a1814] font-mono font-bold border border-[#1a1814] tracking-widest text-xs uppercase rounded-sm transition-all"
          >
            View collection
          </button>
        </div>
      </section>

      {/* 3. Base footer container */}
      <footer className="bg-[#F7F4EE] border-t border-[#e4e0da] py-8 px-4 sm:px-6 md:px-8 text-zinc-650 font-mono text-[10px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-black text-xs tracking-widest text-[#1a1814] uppercase">
              SOLE<span className="text-[#C9A84C]">BOX</span> LK
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500 h-full inline-flex items-center uppercase">Premium Footwear. Smart Price.</span>
            <span className="text-zinc-300">|</span>
            <a href="mailto:soleboxlk@gmail.com" className="text-[#C9A84C] hover:text-[#1a1814] transition-colors lowercase font-semibold">soleboxlk@gmail.com</a>
          </div>

          {/* Social Icons references */}
          <div className="flex items-center gap-4 text-zinc-500">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black">
              <Instagram size={14} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black">
              <Facebook size={14} />
            </a>
          </div>

          {/* Copyright notice */}
          <div className="text-zinc-400">
            © 2026 SoleBox LK. Secured direct imports ports.
          </div>
        </div>
      </footer>
    </div>
  );
}
