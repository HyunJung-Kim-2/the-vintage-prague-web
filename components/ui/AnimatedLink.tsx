"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

const MotionLink = motion.create(Link);

type AnimatedLinkProps = ComponentProps<typeof Link>;

export default function AnimatedLink({ children, className, ...props }: AnimatedLinkProps) {
  return (
    <MotionLink
      {...props}
      className={twMerge("relative inline-block", className)}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-current"
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", transformOrigin: "left" }}
      />
    </MotionLink>
  );
}
