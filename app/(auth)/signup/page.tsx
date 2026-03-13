"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "./actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
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
          <h2 className="font-serif text-2xl text-offwhite mb-4">Check your email</h2>
          <p className="text-muted">We&apos;ve sent you a confirmation link. Please verify your email to continue.</p>
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

        <form action={handleSubmit} className="space-y-4">
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
