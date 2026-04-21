"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store/cart";

export function useCartBounce() {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const prevCount = useRef(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (count > prevCount.current && ref.current) {
      ref.current.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.35)" },
          { transform: "scale(0.9)" },
          { transform: "scale(1)" },
        ],
        { duration: 400, easing: "ease-out" }
      );
    }
    prevCount.current = count;
  }, [count]);

  return { ref, count };
}
