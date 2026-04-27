"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="mt-10">
      <h2 className="font-serif text-xl text-offwhite mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs tracking-widest uppercase text-muted mb-1">New Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-muted mb-1">Confirm New Password</label>
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            className="w-full bg-surface border border-border text-offwhite px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Password updated successfully.</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-burgundy text-offwhite px-8 py-3 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
