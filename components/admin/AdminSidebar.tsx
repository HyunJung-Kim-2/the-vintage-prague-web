"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, LayoutDashboard, Store } from "lucide-react";

const nav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="md:w-52 md:min-h-screen border-b md:border-b-0 md:border-r border-border flex-shrink-0">
      <div className="hidden md:block p-4 border-b border-border">
        <p className="font-serif text-sm text-offwhite tracking-widest">Admin</p>
        <p className="font-serif text-xs text-muted">The Vintage Prague</p>
      </div>
      <nav className="flex md:flex-col md:p-2">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 md:flex-none flex flex-col md:flex-row items-center md:justify-start justify-center gap-1 md:gap-3 px-3 py-3 md:py-2.5 text-[10px] md:text-xs tracking-widest uppercase transition-colors ${
                active ? "bg-surface text-offwhite" : "text-muted hover:text-offwhite"
              }`}
            >
              <Icon size={18} className="md:w-4 md:h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
        {/* Back to live store — clearer exit for non-technical admins */}
        <Link
          href="/"
          className="flex-1 md:flex-none flex flex-col md:flex-row items-center md:justify-start justify-center gap-1 md:gap-3 px-3 py-3 md:py-2.5 md:mt-2 md:border-t md:border-border text-[10px] md:text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors"
        >
          <Store size={18} className="md:w-4 md:h-4" />
          <span>Store</span>
        </Link>
      </nav>
    </aside>
  );
}
