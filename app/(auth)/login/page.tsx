"use client";

import { useState } from "react";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginWithEmail(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-2xl text-offwhite tracking-widest uppercase">
            The Vintage Prague
          </Link>
          <p className="text-muted text-sm mt-2 tracking-wider uppercase">Sign In</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-offwhite py-3 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs text-muted uppercase tracking-widest">or</span>
          </div>
        </div>

        <form action={async () => {
          const result = await loginWithGoogle();
          if (result?.error) setError(result.error);
        }}>
          <button
            type="submit"
            className="w-full border border-border text-offwhite py-3 text-xs tracking-widest uppercase hover:border-offwhite transition-colors"
          >
            Continue with Google
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-offwhite hover:text-burgundy transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
