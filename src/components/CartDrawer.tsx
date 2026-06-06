import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenAuth }: CartDrawerProps) {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    placeOrder, 
    currentUser 
  } = useApp();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!address.trim() || address.length < 10) {
      setValidationError("Please enter a valid, complete delivery address in Sri Lanka.");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setValidationError("Please enter a valid checkout contact phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      const resultingOrder = await placeOrder(address.trim(), phone.trim());
      setOrderCompletedId(resultingOrder.id);
      setAddress("");
      setPhone("");
    } catch (err: any) {
      console.error("Order issue:", err);
      setValidationError(err?.message || "Checkout transaction encountered an issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-reveal">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md bg-zinc-950 border-l border-zinc-900 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
            
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="font-display font-black text-lg tracking-widest text-[#C9A84C] uppercase flex items-center gap-1.5">
                <span>ACCUMULATED BASKET</span>
                <span className="font-mono text-zinc-550 text-xs">({cart.length})</span>
              </h2>
              <button
                id="cart-drawer-close"
                onClick={onClose}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main content body panel */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {orderCompletedId ? (
                /* Success screen */
                <div className="text-center py-10 space-y-4 animate-reveal">
                  <div className="inline-flex items-center justify-center bg-emerald-950/20 text-[#C9A84C] border border-emerald-900/40 p-4 rounded-full">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="font-display font-black text-xl text-white tracking-tight uppercase">ORDER PLACED !</h3>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase">INVOICE CRITICAL SPEC: {orderCompletedId}</p>
                  <p className="font-sans text-xs text-zinc-300 max-w-xs mx-auto leading-relaxed">
                    Your luxury sneaker order is registered in our queue. Our import shipping team will contact you shortly to confirm cash-on-delivery transit!
                  </p>
                  <button
                    id="success-continue-btn"
                    onClick={() => {
                      setOrderCompletedId(null);
                      onClose();
                    }}
                    className="mt-4 px-6 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-xs font-mono tracking-wider font-bold text-zinc-300 hover:text-white rounded cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : cart.length === 0 ? (
                /* Empty basket */
                <div className="text-center py-20 space-y-3">
                  <p className="font-mono text-xs text-zinc-550 uppercase">BAG CONVERT INDEX Empty</p>
                  <p className="font-sans text-xs text-zinc-400">Discover premium sneaker imports and build your ideal wishlist collection.</p>
                </div>
              ) : (
                /* list cart items */
                <div className="divide-y divide-zinc-900 pr-1">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="py-4 flex gap-4 animate-reveal">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-zinc-900 border border-zinc-900">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-display text-xs font-bold text-zinc-200 line-clamp-1">{item.product.name}</h4>
                            <span className="font-mono text-zinc-400 text-xs font-bold">LKR {item.product.price.toLocaleString()}</span>
                          </div>
                          <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">SIZE EUR {item.size}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-1.5 py-0.5 rounded">
                            <button
                              id={`qty-minus-${item.product.id}-${item.size}`}
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="font-mono text-[11px] text-zinc-300 font-bold min-w-[12px] text-center">{item.quantity}</span>
                            <button
                              id={`qty-plus-${item.product.id}-${item.size}`}
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <button
                            id={`qty-trash-${item.product.id}-${item.size}`}
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-zinc-650 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout / Totals footer segment */}
            {!orderCompletedId && cart.length > 0 && (
              <div className="border-t border-zinc-900 pt-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="text-[#C9A84C] font-bold">FREE IMPORT DELIVERY</span>
                  </div>
                  <div className="flex justify-between font-display text-sm font-bold text-white uppercase">
                    <span>ACCUMULATED TOTAL</span>
                    <span className="text-[#C9A84C]">LKR {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Secure Auth Warning if Checkout is pressed without auth */}
                {!currentUser ? (
                  <div className="bg-zinc-950 border border-zinc-900 p-3.5 rounded space-y-2 text-center">
                    <p className="font-sans text-[11px] text-zinc-400">Please sign in to authenticate transactional delivery.</p>
                    <button
                      id="cart-signin-trigger"
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="text-center w-full py-2 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-[10px] tracking-widest rounded transition-all cursor-pointer uppercase"
                    >
                      AUTHENTICATE ACCOUNT
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitCheckout} className="space-y-3.5 animate-reveal">
                    {validationError && (
                      <p className="text-red-400 font-mono text-[10px] uppercase text-center">{validationError}</p>
                    )}

                    <div className="space-y-1.5">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Sri Lanka Home/Office Address</label>
                      <input
                        id="checkout-address-input"
                        type="text"
                        placeholder="No. 50/D, Gregory's Road, Colombo 07"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Contact Phone Number</label>
                      <input
                        id="checkout-phone-input"
                        type="text"
                        placeholder="+94 77 XXX XXXX"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                      />
                    </div>

                    <button
                      id="checkout-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#C9A84C] hover:bg-[#ab862b] disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-display font-black text-xs tracking-widest py-3.5 rounded transition-all cursor-pointer uppercase select-none"
                    >
                      {isSubmitting ? "TRANSMITTING..." : "SUBMIT ORDER VIA C.O.D."}
                      <ArrowRight size={12} className="mt-0.5" />
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
