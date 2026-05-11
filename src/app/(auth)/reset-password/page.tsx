"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Mail, AlertCircle, Check, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0828] p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-bold gradient-text">PrismFlow AI</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <Check size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
            <p className="text-white/50 text-sm mb-6">
              Password reset instructions sent to <strong className="text-white">{email}</strong>
            </p>
            <Link href="/login">
              <Button variant="secondary" icon={<ArrowLeft size={14} />}>
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <Link href="/login" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white mb-8 transition-colors w-fit">
              <ArrowLeft size={14} />
              Back to login
            </Link>

            <h2 className="text-2xl font-bold text-white mb-1">Reset password</h2>
            <p className="text-white/40 text-sm mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={15} />}
                required
              />
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
