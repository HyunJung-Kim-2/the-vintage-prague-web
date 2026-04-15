"use client";

import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/types/database";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (product.stock === 0) {
    return (
      <button disabled className="w-full border border-border text-muted py-4 text-xs tracking-widest uppercase cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full border border-burgundy-vivid text-offwhite py-4 text-xs tracking-[0.12em] uppercase rounded-full hover:bg-burgundy-vivid hover:tracking-[0.16em] transition-all duration-300 ease-out"
    >
      {added ? "Added to Cart \u2713" : "Add to Cart"}
    </button>
  );
}
