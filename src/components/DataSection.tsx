import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useApp } from "../context/AppContext";
import { Shield, Server, Compass, CircleCheck } from "lucide-react";
import { TRACKING_CONCEPTS } from "../data";

export default function DataSection() {
  const { products, orders } = useApp();

  // Create real-time sneaker telemetry from our active state variables!
  const telemetryData = useMemo(() => {
    return products.slice(0, 6).map((product, i) => {
      // Calculate how many times this sneaker was actually ordered in state
      const countOrdersExist = orders.reduce((acc, order) => {
        const itemQty = order.items.filter((it) => it.product.id === product.id)
                            .reduce((sum, item) => sum + item.quantity, 0);
        return acc + itemQty;
      }, 0);

      // Generate aesthetic tracking clicks proportional to standard static IDs plus orders
      const clickMetrics = 85 + (i * 32) + (countOrdersExist * 12);
      const wishlistAdds = 18 + (i * 7) + (countOrdersExist * 3);

      return {
        name: product.name.split("'")[0].slice(0, 16), // shorten sneaker model names for clean charts
        "SNEAKER GLANCE": clickMetrics,
        "WISHLIST ADD": wishlistAdds,
        "CHECKOUT ORDER": countOrdersExist,
      };
    });
  }, [products, orders]);

  return (
    <section id="analytics" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 scroll-mt-20 border-t border-zinc-950">
      
      {/* Editorial Title */}
      <div className="mb-10 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
          <Server size={11} className="text-[#C9A84C]" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A84C] font-black">SERVER TELEMETRY DATA</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">REAL-TIME TREND CONCESS</h2>
        <p className="font-sans text-xs text-zinc-450 max-w-md mx-auto leading-normal">
          Direct monitoring records. Visualizing clicks, wishing actions, and successful conversions bypassing general ad-block variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Recharts Graphical Panel */}
        <div className="lg:col-span-2 bg-[#09090b] border border-zinc-900 p-5 sm:p-6 rounded flex flex-col justify-between">
          <div className="space-y-1 mb-6">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">CONVERSION FUNNEL ANALYTICS</h3>
            <p className="font-mono text-[10px] text-zinc-550 uppercase">DYNAMIC PRODUCT METRIC CHARTS</p>
          </div>

          <div className="h-64 sm:h-80 w-full font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                <XAxis dataKey="name" stroke="#52525b" />
                <YAxis stroke="#52525b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050505",
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                    fontFamily: "monospace",
                    fontSize: "10px",
                  }}
                />
                <Legend iconType="square" align="right" verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} />
                <Bar dataKey="SNEAKER GLANCE" fill="#3f3f46" radius={[2, 2, 0, 0]} />
                <Bar dataKey="WISHLIST ADD" fill="#71717a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="CHECKOUT ORDER" fill="#C9A84C" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Cards detailing custom tracking concepts */}
        <div className="space-y-4 flex flex-col justify-between">
          {TRACKING_CONCEPTS.map((concept, idx) => (
            <div
              key={concept.id}
              className="bg-[#09090b] border border-zinc-900 p-5 rounded relative group hover:border-[#C9A84C]/30 transition-all flex flex-col justify-between flex-1"
            >
              <div className="absolute top-4 right-4 text-[#C9A84C]/10 font-display font-black text-3xl">
                0{idx + 1}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#C9A84C] font-bold uppercase">
                  {idx === 0 && <Compass size={11} />}
                  {idx === 1 && <CircleCheck size={11} />}
                  {idx === 2 && <Shield size={11} />}
                  <span>{concept.title}</span>
                </div>
                <p className="font-sans text-xs text-zinc-400 leading-normal font-normal">
                  {concept.description}
                </p>
              </div>

              <div className="pt-4 font-mono text-[9px] text-zinc-650 uppercase">
                STATUS: ENCRYPTED PORTAL SYNC
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
