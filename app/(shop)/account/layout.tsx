import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-2 mb-10 text-xs tracking-widest uppercase">
        <Link href="/account" className="text-muted hover:text-offwhite transition-colors">Account</Link>
        <span className="text-border">/</span>
        <Link href="/account/orders" className="text-muted hover:text-offwhite transition-colors">Orders</Link>
      </div>
      {children}
    </div>
  );
}
