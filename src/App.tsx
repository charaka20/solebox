import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import DataSection from "./components/DataSection";
import ProcessSection from "./components/ProcessSection";
import TrustSection from "./components/TrustSection";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";

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

  const handleScrollToGrid = () => {
    const el = document.getElementById("shop");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1a1814] font-sans noise-overlay selection:bg-[#C9A84C]/30 selection:text-[#C9A84C]">
      
      {/* Prime Navigation */}
      <Header
        onOrderClick={handleScrollToGrid}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main visual sections */}
      <main className="space-y-4">
        {/* Flags & Heros */}
        <Hero onScrollClick={handleScrollToGrid} />
        
        {/* Custom Step sequence process */}
        <ProcessSection />

        {/* Dynamic products Grid */}
        <ProductGrid />

        {/* Custom Recharts Analytics Panel (Exclusively for Admins) */}
        {isAdmin && <DataSection />}

        {/* Curation notes & Trust */}
        <TrustSection />

        {/* Client Social Proof feedbacks */}
        <Reviews />
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
