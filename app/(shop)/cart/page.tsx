"use client";

import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-3xl text-offwhite mb-4">Your cart is empty</p>
        <Link href="/products" className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
          Continue Shopping &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-offwhite mb-10">Shopping Cart</h1>

      <div className="space-y-6">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-4 border-b border-border pb-6">
            <div className="relative w-20 h-28 bg-surface flex-shrink-0 overflow-hidden">
              {product.product_images?.[0] && (
                <Image
                  src={product.product_images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted tracking-widest uppercase mb-1">{product.brand}</p>
              <p className="text-offwhite font-serif">{product.name}</p>
              <p className="text-offwhite text-sm mt-1">{formatPrice(product.price)}</p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="border border-border p-1 hover:border-offwhite transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="text-offwhite text-sm w-6 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="border border-border p-1 hover:border-offwhite transition-colors disabled:opacity-30"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button onClick={() => removeItem(product.id)} className="text-muted hover:text-offwhite transition-colors">
                <X size={16} />
              </button>
              <p className="text-offwhite text-sm">{formatPrice(product.price * quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-end gap-4">
        <div className="flex items-center gap-8">
          <p className="text-xs tracking-widest uppercase text-muted">Total</p>
          <p className="font-serif text-2xl text-offwhite">{formatPrice(total())}</p>
        </div>
        <p className="text-xs text-muted">Shipping calculated at checkout</p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-burgundy text-offwhite px-12 py-4 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}
