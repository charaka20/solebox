import { User, LogOut, Package, Compass, CheckCircle, Clock, Truck } from "lucide-react";
import { useApp } from "../context/AppContext";

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { currentUser, logout, orders } = useApp();

  if (!currentUser) return null;

  // Filter orders related to this specific authenticated profile
  const myOrders = orders.filter((o) => o.userId === currentUser.id || o.userEmail === currentUser.email);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock size={12} className="text-amber-400" />;
      case "Confirmed":
        return <CheckCircle size={12} className="text-blue-400" />;
      case "Shipped":
        return <Truck size={12} className="text-indigo-400" />;
      case "Delivered":
        return <CheckCircle size={12} className="text-emerald-400" />;
      default:
        return <Clock size={12} className="text-zinc-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-950/20 text-amber-400 border-amber-900/30";
      case "Confirmed":
        return "bg-blue-950/20 text-blue-400 border-blue-900/30";
      case "Shipped":
        return "bg-indigo-950/20 text-indigo-400 border-indigo-900/40";
      case "Delivered":
        return "bg-emerald-950/20 text-emerald-400 border-emerald-900/30";
      default:
        return "bg-zinc-900 text-zinc-400 border-zinc-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-reveal">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded p-6 sm:p-8 flex flex-col max-h-[85vh]">
        
        {/* Core Header info */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 p-2.5 rounded border border-zinc-850">
              <User size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="font-display font-medium text-white leading-tight uppercase">{currentUser.name}</h3>
              <p className="font-mono text-[9px] text-[#C9A84C] uppercase tracking-wider">{currentUser.email}</p>
            </div>
          </div>
          
          <button
            id="close-profile-btn"
            onClick={onClose}
            className="text-xs font-mono tracking-widest text-zinc-500 hover:text-white uppercase cursor-pointer"
          >
            DISMISS
          </button>
        </div>

        {/* History of customer orders */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
            <Package size={14} className="text-[#C9A84C]" />
            <h4 className="font-display font-black text-xs text-white tracking-wider uppercase">MY PURCHASE REGISTRY ({myOrders.length})</h4>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-10">
              <Compass size={24} className="mx-auto text-zinc-800 mb-2" />
              <p className="font-mono text-[10px] text-zinc-550 uppercase">Order log Empty</p>
              <p className="font-sans text-xs text-zinc-400 max-w-xs mx-auto">No orders discovered. Build a collection in your cart to submit details.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order.id} className="border border-zinc-900 bg-[#09090b] p-4 sm:p-5 rounded space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-zinc-900">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-550 uppercase tracking-wide">ID SPEC</span>
                      <p className="font-mono text-xs text-zinc-200 font-bold">{order.id}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-mono text-[9px] text-zinc-550 tracking-wider uppercase">{order.date}</span>
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] px-2.5 py-1 rounded border uppercase ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* List of Sneaker items of order */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <div className="flex gap-2 items-center">
                          <span className="font-mono text-[#C9A84C]">x{item.quantity}</span>
                          <span className="font-sans text-zinc-300 font-medium">{item.product.name}</span>
                          <span className="font-mono text-[9px] text-zinc-550 uppercase">SIZE {item.size}</span>
                        </div>
                        <span className="font-mono text-zinc-400 font-bold">LKR {(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order tracking footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2.5 border-t border-zinc-900">
                    <div className="font-mono text-[10px] text-zinc-400 uppercase">
                      <span className="text-zinc-550">SHIPPED TO:</span> <span className="text-zinc-300 font-sans normal-case">{order.deliveryAddress}</span>
                    </div>
                    
                    <div className="font-mono text-sm font-bold text-white uppercase flex items-baseline gap-2">
                      <span className="text-[10px] text-zinc-500 font-normal">LKR TOTAL:</span>
                      <span className="text-[#C9A84C]">LKR {order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {order.courierTracking && (
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded font-mono text-[10px] text-[#C9A84C] flex items-center justify-between">
                      <span>COURIER DMX TRACKING NUMBER:</span>
                      <span className="font-bold tracking-widest">{order.courierTracking}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss and session logouts */}
        <div className="border-t border-zinc-900 pt-5 flex items-center justify-between">
          <p className="font-mono text-[9px] text-zinc-650 uppercase">AUTHENTICATED CREDENTIAL PROXY RECORD</p>
          <button
            id="profile-logout-btn"
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="flex items-center gap-1.5 font-mono text-[10px] text-red-400 hover:text-red-300 uppercase cursor-pointer"
          >
            <LogOut size={11} />
            <span>DISCONNECT SECURE SESSION</span>
          </button>
        </div>

      </div>
    </div>
  );
}
