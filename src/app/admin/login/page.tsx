"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@rbmakeover.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please verify and retry.");
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A08] text-[#F5EFEB] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#C59B46] selection:text-black">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(197,155,70,0.12)_0%,rgba(7,10,8,0)_70%)] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C59B46] shadow-[0_0_25px_rgba(197,155,70,0.35)]">
            <Image
              src="/images/rb-makeover-logo-badge.png"
              alt="R.B Makeover Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono uppercase tracking-widest text-[#C59B46] mb-4 hover:border-[#C59B46]/40 transition-colors"
        >
          R.B Makeover Man&apos;s Salon
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#F5EFEB] tracking-tight">
          Executive <span className="text-[#C59B46] italic">Portal</span>
        </h1>
        <p className="mt-2 text-sm text-[#A8A29E]">
          Secure content management &amp; salon administration
        </p>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0E1411]/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08] mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C59B46]/10 border border-[#C59B46]/30 flex items-center justify-center text-[#C59B46]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F5EFEB]">
              Admin Authentication
            </h2>
            <p className="text-xs text-[#7A756B]">Sign in to edit team, gallery, and pricing</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-[#DFC074] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A756B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rbmakeover.com"
                className="w-full bg-[#141C18] border border-white/[0.1] focus:border-[#C59B46] rounded-xl py-3 pl-10 pr-4 text-sm text-[#F5EFEB] placeholder-[#7A756B] focus:outline-none focus:ring-1 focus:ring-[#C59B46] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-[#DFC074] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A756B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#141C18] border border-white/[0.1] focus:border-[#C59B46] rounded-xl py-3 pl-10 pr-4 text-sm text-[#F5EFEB] placeholder-[#7A756B] focus:outline-none focus:ring-1 focus:ring-[#C59B46] transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(197,155,70,0.4)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <Link
            href="/"
            className="text-xs text-[#7A756B] hover:text-[#C59B46] transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
