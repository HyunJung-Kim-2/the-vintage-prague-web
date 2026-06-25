"use client";

import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice, conditionLabel } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, syncItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  // Validate cart items against live DB data on mount
  useEffect(() => {
    async function validateCart() {
      if (items.length === 0) { setSyncing(false); return; }
      const supabase = createClient();
      const ids = items.map((i) => i.product.id);
      const { data: liveProducts } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .in("id", ids);

      const newWarnings: string[] = [];

      for (const item of items) {
        const live = liveProducts?.find((p) => p.id === item.product.id);
        if (!live || !live.is_active) {
          newWarnings.push(`"${item.product.name}" is no longer available and was removed.`);
          removeItem(item.product.id);
        } else if (live.stock === 0) {
          newWarnings.push(`"${item.product.name}" is sold out and was removed.`);
          removeItem(item.product.id);
        } else {
          // Sync price, stock, images etc.
          if (live.price !== item.product.price || live.stock !== item.product.stock || live.name !== item.product.name) {
            syncItem(item.product.id, live);
          }
          if (item.quantity > live.stock) {
            newWarnings.push(`"${live.name}" quantity adjusted to ${live.stock} (max available).`);
            updateQuantity(item.product.id, live.stock);
          }
        }
      }
      setWarnings(newWarnings);
      setSyncing(false);
    }
    validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (syncing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-muted text-sm tracking-widest uppercase">Updating cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Your Bag</p>
        <p className="font-serif text-3xl text-offwhite mb-6">Your cart is empty</p>
        {warnings.length > 0 && (
          <div className="mb-6 space-y-1">
            {warnings.map((w, i) => (
              <p key={i} className="text-xs text-red-400">{w}</p>
            ))}
          </div>
        )}
        <Link href="/products" className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
          Continue Shopping &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">Your Bag</p>
        <h1 className="font-serif text-3xl text-offwhite mb-2">Shopping Cart</h1>
        <p className="text-muted text-sm">
          {items.reduce((n, i) => n + i.quantity, 0)} {items.reduce((n, i) => n + i.quantity, 0) === 1 ? "item" : "items"}
        </p>
      </div>

      {warnings.length > 0 && (
        <div className="mb-6 border border-red-800 bg-red-950/30 p-4 space-y-1">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-red-400">{w}</p>
          ))}
        </div>
      )}

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
              <div className="flex gap-3 mt-1 text-xs text-muted">
                {product.size && <span>{product.size}</span>}
                {product.size && product.condition && <span>·</span>}
                {product.condition && <span>{conditionLabel(product.condition)}</span>}
              </div>
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
        {isLoggedIn === false ? (
          <div className="text-center space-y-3">
            <p className="text-xs text-muted">Sign in to complete your purchase</p>
            <Link
              href="/login"
              className="inline-block bg-burgundy text-offwhite px-12 py-4 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors"
            >
              Sign In to Checkout
            </Link>
            <p className="text-xs text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-offwhite hover:text-burgundy transition-colors">Sign up</Link>
            </p>
          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading || isLoggedIn === null}
            className="bg-burgundy text-offwhite px-12 py-4 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Proceed to Checkout"}
          </button>
        )}
      </div>
    </div>
  );
}
