import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/login/actions";
import CartCount from "./CartCount";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Nav left */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
              Shop
            </Link>
            <Link href="/products?category=bags" className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
              Bags
            </Link>
            <Link href="/products?category=clothing" className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
              Clothing
            </Link>
          </nav>

          {/* Logo center */}
          <Link href="/" className="font-serif text-xl tracking-widest uppercase text-offwhite absolute left-1/2 -translate-x-1/2">
            The Vintage Prague
          </Link>

          {/* Icons right */}
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/products" className="text-muted hover:text-offwhite transition-colors">
              <Search size={18} />
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="text-muted hover:text-offwhite transition-colors">
                  <User size={18} />
                </Link>
                <form action={signOut}>
                  <button className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
                    Out
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="text-muted hover:text-offwhite transition-colors">
                <User size={18} />
              </Link>
            )}
            <Link href="/cart" className="text-muted hover:text-offwhite transition-colors relative">
              <ShoppingBag size={18} />
              <CartCount />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
