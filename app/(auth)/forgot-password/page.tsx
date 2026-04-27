"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await requestPasswordReset(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Check your inbox</p>
          <h2 className="font-serif text-3xl text-offwhite mb-4">Reset link sent</h2>
          <p className="text-muted text-sm leading-relaxed mb-3">
            We&apos;ve sent a password reset link to your email address.
          </p>
          <p className="text-muted text-xs leading-relaxed">
            Can&apos;t find it? Check your <strong className="text-offwhite/60">spam or junk folder</strong>.
          </p>
          <Link
            href="/login"
            className="inline-block mt-8 text-xs tracking-widest uppercase text-offwhite border-b border-offwhite/40 hover:border-offwhite transition-colors pb-0.5"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-2xl text-offwhite tracking-widest uppercase">
            The Vintage Prague
          </Link>
          <p className="text-muted text-sm mt-2 tracking-wider uppercase">Reset Password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-offwhite py-3 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          <Link href="/login" className="text-offwhite hover:text-burgundy transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
