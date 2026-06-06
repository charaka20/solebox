import { ShoppingBag, Shield, User as UserIcon, LogOut, Disc } from "lucide-react";
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

  const totalCartQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F4EE]/90 backdrop-blur-md border-b border-[#e4e0da] px-4 sm:px-6 md:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand signature Logo */}
        <div className="flex items-center gap-2 group">
          <Disc size={20} className="text-[#C9A84C] animate-spin" style={{ animationDuration: "12s" }} />
          <span className="font-display font-black text-lg sm:text-xl tracking-[0.25em] text-[#1a1814] select-none cursor-pointer">
            SOLE<span className="text-[#C9A84C]">BOX</span> <span className="font-sans text-[9px] tracking-widest uppercase text-zinc-400">LK</span>
          </span>
        </div>

        {/* Access controls and shopping tools */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            id="nav-shop-btn"
            onClick={onOrderClick}
            className="hidden sm:inline-flex text-xs font-mono font-bold tracking-widest text-[#1a1814]/70 hover:text-black uppercase cursor-pointer select-none py-1.5 px-3 transition-colors"
          >
            Collection
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("philosophy");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:inline-flex text-xs font-mono font-bold tracking-widest text-[#1a1814]/70 hover:text-black uppercase cursor-pointer select-none py-1.5 px-3 transition-colors"
          >
            Story
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("delivery");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:inline-flex text-xs font-mono font-bold tracking-widest text-[#1a1814]/70 hover:text-black uppercase cursor-pointer select-none py-1.5 px-3 transition-colors"
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
            className="relative flex items-center justify-center border border-[#e4e0da] hover:border-zinc-400 bg-white p-2.5 rounded cursor-pointer text-[#1a1814] hover:text-[#C9A84C] transition-all"
            title="Open Accumulated Cart"
          >
            <ShoppingBag size={15} />
            {totalCartQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1a1814] text-[9px] font-black text-[#F7F4EE] px-1 leading-none shadow-md">
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
              className="bg-[#1a1814] hover:bg-zinc-800 text-white font-mono font-bold text-[10px] sm:text-xs tracking-widest py-2 px-4 rounded transition-all cursor-pointer select-none"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
