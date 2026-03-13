"use client";

import { useCartStore } from "@/lib/store/cart";

export default function CartCount() {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-burgundy text-offwhite text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
      {count}
    </span>
  );
}
