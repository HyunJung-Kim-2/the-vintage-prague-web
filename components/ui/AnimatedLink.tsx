"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";

type AnimatedLinkProps = ComponentProps<typeof Link> & {
  className?: string;
};

export default function AnimatedLink({ children, className = "", ...props }: AnimatedLinkProps) {
  return (
    <Link {...props} className={`relative group inline-block ${className}`}>
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-current"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", transformOrigin: "left" }}
      />
    </Link>
  );
}
