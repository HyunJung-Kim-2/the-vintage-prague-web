import Link from "next/link";
import Image from "next/image";
import { formatPrice, conditionLabel } from "@/lib/utils";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  const firstImage = product.product_images?.[0]?.url;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-surface overflow-hidden mb-3">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs tracking-widest uppercase">
            No Image
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-background/80 text-offwhite text-[10px] tracking-widest uppercase px-2 py-1">
            {conditionLabel(product.condition)}
          </span>
        </div>
      </div>
      <div>
        {product.brand && (
          <p className="text-muted text-xs tracking-widest uppercase mb-1">{product.brand}</p>
        )}
        <p className="text-offwhite text-sm font-serif">{product.name}</p>
        <p className="text-offwhite text-sm mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
