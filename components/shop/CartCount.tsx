"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useCartBounce } from "@/hooks/useCartBounce";

export default function CartCount() {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const controls = useCartBounce();

  if (count === 0) return null;

  return (
    <motion.span
      animate={controls}
      className="absolute -top-1 -right-1 bg-burgundy text-offwhite text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
    >
      {count}
    </motion.span>
  );
}
