"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-burgundy text-4xl mb-6">&check;</p>
        <h1 className="font-serif text-3xl text-offwhite mb-4">Order Confirmed</h1>
        <p className="text-muted mb-8 leading-relaxed">
          Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="inline-block border border-offwhite text-offwhite text-xs tracking-widest uppercase px-8 py-3 hover:bg-offwhite hover:text-background transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/products"
            className="inline-block text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors py-3"
          >
            Continue Shopping &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
