import React, { useState } from "react";
import { X, Mail, ShieldAlert, KeyRound } from "lucide-react";
import { useApp } from "../context/AppContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signInWithGoogle } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please specify a valid email address.");
      return;
    }

    try {
      if (isSignUp) {
        login(email, name || email.split("@")[0]);
      } else {
        login(email);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed during validation.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Auth helper diagnostic:", err);
      const errCode = err?.code || "";
      const errMsg = err?.message || "";
      
      if (
        errCode === "auth/cancelled-popup-request" ||
        errCode === "auth/popup-blocked" ||
        errCode === "auth/popup-closed-by-user" ||
        errMsg.includes("cancelled-popup-request") ||
        errMsg.includes("popup-blocked") ||
        errMsg.includes("popup-closed-by-user")
      ) {
        setError(
          "Authentication popups are restricted inside standard preview frames. Please click the 'Open in new tab' button at the top-right of your screen to sign in, or enter your email in the 'Direct Bypass' field below for instant bypass entry."
        );
      } else {
        setError(errMsg || "Google authentication failed. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-reveal">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded p-6 sm:p-8 relative">
        
        {/* Close trigger button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-550 hover:text-white cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="space-y-6">
          
          {/* Header branding info */}
          <div className="text-center">
            <h3 className="font-display font-black text-xl text-white tracking-widest uppercase">SECURE PASS ENTRY</h3>
            <p className="font-mono text-[9px] text-[#C9A84C] uppercase tracking-wider mt-1">LOCK ID AUTHENTICATION</p>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-900/40 p-3 rounded flex items-start gap-2 text-red-400 font-mono text-[10px] uppercase">
              <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Social Sign-In (Recommended) */}
          <div className="space-y-2">
            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-display text-xs tracking-widest font-black uppercase py-3 rounded transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current text-[#C9A84C]" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.185 15.456 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.455 10.55-10.725 0-.721-.077-1.272-.172-1.69H12.24z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-[1px] bg-zinc-900" />
              <span className="font-mono text-[8px] text-zinc-650 px-3 uppercase tracking-widest">OR DIRECT BYPASS</span>
              <div className="flex-1 h-[1px] bg-zinc-900" />
            </div>
          </div>

          {/* Form Entry */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">User Identifier Name</label>
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="e.g. Ruwan Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white p-2.5 rounded font-sans"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] text-zinc-550 uppercase tracking-wider">Secure Email Address</label>
              <div className="relative">
                <input
                  id="auth-email-input"
                  type="email"
                  placeholder="review-admin@solebox.lk"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C9A84C] outline-none text-xs text-white pl-9 pr-3 py-2.5 rounded font-sans"
                />
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650" />
              </div>
              <p className="font-mono text-[8px] text-zinc-600 uppercase tracking-tight">Enter an email containing "admin" to trigger direct administrator portal rights.</p>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-black font-display font-black text-xs tracking-widest py-3.5 rounded transition-all cursor-pointer uppercase select-none"
            >
              <KeyRound size={12} className="mt-0.5" />
              <span>{isSignUp ? "INITIALIZE ACCOUNT" : "AUTHENTICATE ENTER"}</span>
            </button>
          </form>

          {/* Sign up indicator options */}
          <div className="text-center pt-2">
            <button
              id="toggle-signup"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase transition-colors cursor-pointer select-none"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need a bypass profile? Create Account"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
