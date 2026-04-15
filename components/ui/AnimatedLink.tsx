"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import type { ComponentProps } from "react";

type AnimatedLinkProps = ComponentProps<typeof Link>;

export default function AnimatedLink({ children, className, ...props }: AnimatedLinkProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      {...props}
      className={twMerge("relative inline-block", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-current"
        animate={hovered ? "hover" : "default"}
        variants={{
          hover: { scaleX: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
          default: { scaleX: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
        }}
        style={{ width: "100%", transformOrigin: "left" }}
      />
    </Link>
  );
}
