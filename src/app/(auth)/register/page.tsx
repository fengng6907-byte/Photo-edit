"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle, Check } from "lucide-react";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0828] p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
          <p className="text-white/50 mb-6">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Button variant="secondary" onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#08061f] items-center justify-center overflow-hidden">
        <div className="orb orb-purple absolute -top-40 -left-40 w-[500px] h-[500px] opacity-50" />
        <div className="orb orb-blue absolute -bottom-40 -right-40 w-[400px] h-[400px] opacity-40" />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow mx-auto mb-8">
            <Sparkles size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Start for Free</h1>
          <p className="text-white/50 text-lg max-w-sm mb-8">
            Get 10 free AI credits every month. No credit card required.
          </p>
          <div className="space-y-3 text-left">
            {[
              "10 AI credits monthly",
              "Background removal",
              "Basic cinematic filters",
              "1 GB storage",
              "Export up to 1080p",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-emerald-400" />
                </div>
                <span className="text-sm text-white/60">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0828] overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold gradient-text">PrismFlow AI</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-white/40 text-sm mb-8">Start editing with AI in seconds</p>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            variant="glass"
            className="w-full mb-6"
            size="lg"
            loading={googleLoading}
            onClick={handleGoogleLogin}
            icon={
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
          >
            Sign up with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0a0828] text-white/30">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={15} />}
              required
              autoComplete="name"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={15} />}
              required
              autoComplete="email"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/60 transition-all duration-200 text-sm"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password && (
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${rule.test(password) ? "bg-emerald-500/30" : "bg-white/10"}`}>
                        {rule.test(password) && <Check size={8} className="text-emerald-400" />}
                      </div>
                      <span className={`text-[10px] ${rule.test(password) ? "text-emerald-400" : "text-white/30"}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-white/30">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-brand-400 hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
