import { useState, useEffect } from "react";
import { ShoppingBag, Shield, User as UserIcon, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";

interface HeaderProps {
  onOrderClick: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export default function Header({
  onOrderClick,
  onOpenCart,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
}: HeaderProps) {
  const { currentUser, logout, cart, isAdmin } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 px-4 sm:px-6 md:px-8 ${
        isScrolled
          ? "bg-white/95 shadow-md border-b border-[#d8d3c9] py-2 sm:py-3"
          : "bg-[#F7F4EE]/90 backdrop-blur-md border-b border-[#e4e0da] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand signature Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onOrderClick}>
          <img 
            src="/images/Logo.png" 
            alt="SoleBox LK Logo" 
            className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply select-none" 
            referrerPolicy="no-referrer" 
          />
          <span className="font-display font-black text-lg sm:text-xl tracking-[0.2em] text-[#1A1712] select-none">
            SOLE<span className="text-[#C9A84C]">BOX</span> <span className="font-sans text-[8px] tracking-widest uppercase text-zinc-400">LK</span>
          </span>
        </div>

        {/* Access controls and shopping tools */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            id="nav-shop-btn"
            onClick={onOrderClick}
            className="hidden sm:inline-flex text-xs font-mono font-bold tracking-widest text-[#1A1712]/70 hover:text-black uppercase cursor-pointer select-none py-1.5 px-3 transition-colors"
          >
            Collection
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("philosophy");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:inline-flex text-xs font-mono font-bold tracking-widest text-[#1A1712]/70 hover:text-black uppercase cursor-pointer select-none py-1.5 px-3 transition-colors"
          >
            Story
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("delivery");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:inline-flex text-xs font-mono font-bold tracking-widest text-[#1A1712]/70 hover:text-black uppercase cursor-pointer select-none py-1.5 px-3 transition-colors"
          >
            Delivery
          </button>

          {/* Admin Indicator/Trigger */}
          {isAdmin && (
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] sm:text-xs font-mono font-bold tracking-wider py-1.5 px-3 rounded cursor-pointer hover:bg-[#C9A84C]/25 transition-all uppercase animate-pulse-slow"
            >
              <Shield size={12} />
              <span>Admin section</span>
            </button>
          )}

          {/* Accumulate basket Trigger */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center justify-center border border-[#e4e0da] hover:border-zinc-400 bg-white p-2.5 rounded cursor-pointer text-[#1A1712] hover:text-[#C9A84C] transition-all"
            title="Open Accumulated Cart"
          >
            <ShoppingBag size={15} />
            {totalCartQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1A1712] text-[9px] font-black text-[#F7F4EE] px-1 leading-none shadow-md">
                {totalCartQty}
              </span>
            )}
          </button>

          {/* Account/Status Profile button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="header-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 border border-[#e4e0da] bg-white hover:bg-zinc-50 cursor-pointer text-xs font-mono tracking-wider text-zinc-700 hover:text-black py-1.5 px-3 rounded transition-colors"
              >
                <UserIcon size={12} className="text-[#C9A84C]" />
                <span className="hidden md:inline max-w-[80px] truncate">{currentUser.name}</span>
              </button>

              <button
                id="header-logout-btn"
                onClick={logout}
                className="border border-[#e4e0da] bg-white hover:bg-red-50 hover:border-red-200 p-2.5 rounded cursor-pointer text-zinc-500 hover:text-red-600 transition-all"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="bg-[#1A1712] hover:bg-zinc-800 text-white font-mono font-bold text-[10px] sm:text-xs tracking-widest py-2 px-4 rounded transition-all cursor-pointer select-none"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
