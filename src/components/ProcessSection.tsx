import { Search, ShieldCheck, Truck } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      icon: <Search size={20} className="text-[#C9A84C]" />,
      title: "PREMIUM GLOBAL CURATION",
      description: "Our dedicated sneaker team sources highly-coveted upcoming drops directly from authorized distributors across global hubs with authentic credentials."
    },
    {
      icon: <ShieldCheck size={20} className="text-[#C9A84C]" />,
      title: "FACTORY AUTHENTICATION",
      description: "Every shoe undergoes exhaustive 12-point authentication inspections, ensuring 100% factory-seal security, correct stitching, and un-compromised fit."
    },
    {
      icon: <Truck size={20} className="text-[#C9A84C]" />,
      title: "TRUSTED EXPORT DELIVERY",
      description: "Sneakers fly straight through clearance channels into Sri Lanka, package insulated under extreme temperature monitoring, dispatched with instant courier tracking."
    }
  ];

  return (
    <section id="process" className="bg-[#1a1814] text-[#F7F4EE] py-16 scroll-mt-20 border-t border-[#e4e0da]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Title */}
        <div className="mb-12 space-y-2 text-center sm:text-left">
          <div className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C] uppercase font-bold">THE SOLEBOX SYSTEM</div>
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#F7F4EE] uppercase tracking-tight">SECURE TRANSACTIONS SEQUENCE</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#24221c]/50 border border-[#2e2c24] p-6 sm:p-8 rounded-sm space-y-4 hover:border-[#C9A84C]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="bg-[#1a1814] p-2.5 rounded border border-[#2e2c24]">
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
