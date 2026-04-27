"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-muted leading-relaxed max-w-2xl">
          This site uses essential cookies for cart and login functionality.
          By continuing to browse, you agree to our{" "}
          <a href="/privacy" className="text-offwhite underline underline-offset-2 hover:text-burgundy-vivid transition-colors">
            Privacy Policy
          </a>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 text-xs tracking-widest uppercase px-6 py-2.5 bg-burgundy text-offwhite hover:bg-burgundy-light transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
