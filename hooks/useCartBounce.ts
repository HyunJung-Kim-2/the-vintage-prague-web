"use client";

import { useEffect, useRef } from "react";
import { useAnimationControls } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";

export function useCartBounce() {
  const controls = useAnimationControls();
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      controls.start({
        scale: [1, 1.35, 0.9, 1],
        transition: { duration: 0.4, ease: "easeOut" },
      });
    }
    prevCount.current = count;
  }, [count, controls]);

  return controls;
}
