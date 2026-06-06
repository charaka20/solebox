import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import DataSection from "./components/DataSection";
import ProcessSection from "./components/ProcessSection";
import TrustSection from "./components/TrustSection";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import UGCStrip from "./components/UGCStrip";

// Modals
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import UserProfile from "./components/UserProfile";
import AdminDashboard from "./components/AdminDashboard";

function MainAppContent() {
  const { isAdmin } = useApp();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollToGrid = () => {
    const el = document.getElementById("shop");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1A1712] font-sans noise-overlay selection:bg-[#C9A84C]/30 selection:text-[#C9A84C]">
      
      {/* Dynamic Announcement Scrolling Marquee Bar */}
      <div className="w-full bg-[#1A1712] text-[#C9A84C] py-2 border-b border-black overflow-hidden select-none relative z-50">
        <div className="flex animate-marquee whitespace-nowrap text-[9px] sm:text-xs font-mono font-medium tracking-widest uppercase gap-8">
          <span>🚚 Free island-wide delivery • 💵 Cash on delivery • New drops every week • EU 39–45 in stock</span>
          <span>🚚 Free island-wide delivery • 💵 Cash on delivery • New drops every week • EU 39–45 in stock</span>
          <span>🚚 Free island-wide delivery • 💵 Cash on delivery • New drops every week • EU 39–45 in stock</span>
          <span>🚚 Free island-wide delivery • 💵 Cash on delivery • New drops every week • EU 39–45 in stock</span>
        </div>
      </div>

      {/* Prime Navigation */}
      <Header
        onOrderClick={handleScrollToGrid}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main visual sections with premium scroll animations */}
      <main className="space-y-4">
        {/* Hero loads immediately for layout performance */}
        <Hero onScrollClick={handleScrollToGrid} />
        
        {/* Custom Step sequence process with animation */}
        <ScrollReveal>
          <ProcessSection />
        </ScrollReveal>

        {/* Dynamic products Grid with animation */}
        <ScrollReveal>
          <ProductGrid />
        </ScrollReveal>

        {/* Custom Recharts Analytics Panel (Exclusively for Admins) */}
        {isAdmin && (
          <ScrollReveal>
            <DataSection />
          </ScrollReveal>
        )}

        {/* Curation notes & Trust with animation */}
        <ScrollReveal>
          <TrustSection />
        </ScrollReveal>

        {/* Client Social Proof feedbacks with animation */}
        <ScrollReveal>
          <Reviews />
        </ScrollReveal>

        {/* Brand User Generated Lifestyle Feed Strip */}
        <ScrollReveal>
          <UGCStrip />
        </ScrollReveal>
      </main>

      {/* Footer credits segment */}
      <Footer />

      {/* Slideout basket drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Authentication and Direct bypass Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Profile summary screen */}
      {isProfileOpen && (
        <UserProfile
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* Admin management panel and custom Sneaker Creators */}
      {isAdmin && isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Elegant WhatsApp conversion incentive tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={() => setShowTooltip(false)}
            className="fixed bottom-22 right-6 z-40 bg-[#1A1712] text-white text-[10px] sm:text-[11px] font-mono tracking-wider px-4 py-2.5 rounded-lg shadow-2xl cursor-pointer border border-[#C9A84C]/40 flex items-center gap-1.5 hover:bg-black select-none max-w-[210px] transition-colors"
          >
            <span className="text-xs">👟</span>
            <span className="font-bold">Order in 60 seconds →</span>
            <span className="absolute bottom-[-5px] right-8 w-2.5 h-2.5 bg-[#1A1712] border-r border-b border-[#C9A84C]/40 rotate-45"></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Gold WhatsApp Order Button (Always Visible) */}
      <a
        href="https://wa.me/94722401093?text=Hi%20SoleBox%20LK!%20I'm%20visiting%20your%20curated%20store%20and%20would%20like%20to%20order%20premium%20shoes."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#C9A84C] hover:bg-[#b0913c] text-black font-mono font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] py-3.5 px-5 rounded-full shadow-2xl flex items-center gap-2 border border-black/20 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
        title="Order via WhatsApp"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
        </span>
        <MessageSquare size={13} className="fill-current text-black" />
        <span>Order on WhatsApp</span>
      </a>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
