"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "./actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Almost there</p>
          <h2 className="font-serif text-3xl text-offwhite mb-4">Check your email</h2>
          <p className="text-muted text-sm leading-relaxed mb-3">
            We&apos;ve sent a confirmation link to your email address.
            Click it to activate your account.
          </p>
          <p className="text-muted text-xs leading-relaxed">
            Can&apos;t find it? Check your <strong className="text-offwhite/60">spam or junk folder</strong> —
            it sometimes ends up there.
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
          <p className="text-muted text-sm mt-2 tracking-wider uppercase">Create Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">Full Name</label>
            <input
              name="full_name"
              type="text"
              required
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">Confirm Password</label>
            <input
              name="confirm_password"
              type="password"
              required
              minLength={8}
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-offwhite py-3 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-offwhite hover:text-burgundy transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
