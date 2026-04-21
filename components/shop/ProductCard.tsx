import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  const firstImage = product.product_images?.[0]?.url;
  const soldOut = product.stock === 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-surface overflow-hidden mb-3">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              soldOut ? "opacity-50" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs tracking-widest uppercase">
            No Image
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border border-offwhite/60 text-offwhite text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 bg-background/70 backdrop-blur-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div>
        {product.brand && (
          <p className="text-muted text-xs tracking-widest uppercase mb-1">{product.brand}</p>
        )}
        <p className={`text-sm font-serif ${soldOut ? "text-muted" : "text-offwhite"}`}>
          {product.name}
        </p>
        <p className={`text-sm mt-1 ${soldOut ? "text-muted" : "text-offwhite"}`}>
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
