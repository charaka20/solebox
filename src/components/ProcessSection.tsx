import { Search, ShieldCheck, Truck } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      icon: <Search size={20} className="text-[#C9A84C]" />,
      title: "WE FIND IT",
      description: "We handpick each pair for quality, fit, and durability — then ship directly to your door."
    },
    {
      icon: <ShieldCheck size={20} className="text-[#C9A84C]" />,
      title: "WE CHECK IT",
      description: "Every shoe undergoes an intensive physical and aesthetic inspection to verify proper stitching, material grade, and sizing accuracy before packing."
    },
    {
      icon: <Truck size={20} className="text-[#C9A84C]" />,
      title: "WE DELIVER IT",
      description: "Your handpicked pair is quickly dispatched with premium wrapping and tracking details, delivered safely to any address in Sri Lanka with Cash on Delivery."
    }
  ];

  return (
    <section id="process" className="bg-[#1A1712] text-[#F7F4EE] py-16 scroll-mt-20 border-t border-[#e4e0da]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Title */}
        <div className="mb-12 space-y-2 text-center sm:text-left">
          <div className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C] uppercase font-bold">THE SOLEBOX SYSTEM</div>
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#F7F4EE] uppercase tracking-tight">HOW IT WORKS</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#24221c]/50 border border-[#2e2c24] p-6 sm:p-8 rounded-sm space-y-4 hover:border-[#C9A84C]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="bg-[#1A1712] p-2.5 rounded border border-[#2e2c24]">
                  {step.icon}
                </div>
                <div className="font-mono text-xs text-[#C9A84C] tracking-widest font-black">
                  [ 0{index + 1} ]
                </div>
              </div>
              <h4 className="font-display font-bold text-sm text-white tracking-wide">{step.title}</h4>
              <p className="font-sans text-xs text-zinc-400 leading-relaxed font-normal">{step.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
