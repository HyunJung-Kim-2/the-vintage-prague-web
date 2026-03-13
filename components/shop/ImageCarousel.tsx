"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/types/database";

export default function ImageCarousel({ images }: { images: ProductImage[] }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-surface flex items-center justify-center text-muted text-xs tracking-widest uppercase">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] bg-surface overflow-hidden">
        <Image
          src={images[current].url}
          alt={`Product image ${current + 1}`}
          fill
          className="object-cover"
          priority={current === 0}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 p-2 hover:bg-background transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 p-2 hover:bg-background transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-offwhite" : "bg-muted"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrent(i)}
              className={`relative aspect-square overflow-hidden border transition-colors ${i === current ? "border-offwhite" : "border-border"}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
