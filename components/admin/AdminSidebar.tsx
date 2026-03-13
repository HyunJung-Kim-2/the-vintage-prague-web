"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, LayoutDashboard } from "lucide-react";

const nav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-16 md:w-52 border-r border-border flex-shrink-0">
      <div className="p-4 border-b border-border">
        <p className="font-serif text-sm text-offwhite hidden md:block tracking-widest">Admin</p>
        <p className="font-serif text-xs text-muted hidden md:block">The Vintage Prague</p>
      </div>
      <nav className="p-2 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase transition-colors ${
              pathname === href ? "bg-surface text-offwhite" : "text-muted hover:text-offwhite"
            }`}
          >
            <Icon size={16} />
            <span className="hidden md:block">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
