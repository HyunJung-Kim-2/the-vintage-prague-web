"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

type AnimatedLinkProps = ComponentProps<typeof Link>;

export default function AnimatedLink({ children, className, ...props }: AnimatedLinkProps) {
  return (
    <Link
      {...props}
      className={twMerge(
        "relative inline-block group",
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-current origin-left scale-x-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </Link>
  );
}
