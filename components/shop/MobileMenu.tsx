"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/products", label: "All Pieces" },
  { href: "/products?category=bags", label: "Bags" },
  { href: "/products?category=clothing", label: "Clothing" },
  { href: "/products?category=shoes", label: "Shoes" },
  { href: "/products?category=wallets", label: "Wallets" },
  { href: "/shipping", label: "Shipping & Returns" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-muted hover:text-offwhite transition-colors p-1"
        aria-label="Menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-background flex flex-col">
          <nav className="flex flex-col px-6 pt-8 pb-12 gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm tracking-widest uppercase text-muted hover:text-offwhite transition-colors py-3 border-b border-border/50"
              >
                {label}
              </Link>
            ))}
            <div className="mt-6">
              {isLoggedIn ? (
                <>
                  <Link href="/account" className="block text-sm tracking-widest uppercase text-muted hover:text-offwhite transition-colors py-3 border-b border-border/50">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="block text-sm tracking-widest uppercase text-muted hover:text-offwhite transition-colors py-3 border-b border-border/50">
                    Orders
                  </Link>
                </>
              ) : (
                <Link href="/login" className="block text-sm tracking-widest uppercase text-muted hover:text-offwhite transition-colors py-3 border-b border-border/50">
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
