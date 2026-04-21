import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImageCarousel from "@/components/shop/ImageCarousel";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { formatPrice, categoryLabel, conditionLabel } from "@/lib/utils";
import FadeIn from "@/components/ui/FadeIn";

const conditionDesc: Record<string, string> = {
  new:  "Brand new, never worn, with or without tags.",
  s:    "Like new. Minimal to no signs of use.",
  a:    "Gently used. Light wear, no notable flaws.",
  b:    "Visible signs of wear. Minor flaws noted in description.",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const images = (product.product_images ?? []).sort(
    (a: { position: number }, b: { position: number }) => a.position - b.position
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <FadeIn delay={0} y={12}>
          <ImageCarousel images={images} />
        </FadeIn>

        {/* Details */}
        <div className="flex flex-col gap-6">
          {product.brand && (
            <FadeIn delay={0}>
              <p className="text-xs tracking-widest uppercase text-muted">{product.brand}</p>
            </FadeIn>
          )}
          <FadeIn delay={0.08}>
            <h1 className="font-serif text-3xl text-offwhite">{product.name}</h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="font-serif text-2xl text-offwhite">{formatPrice(product.price)}</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted mb-1">Category</p>
                <p className="text-offwhite">{categoryLabel(product.category)}</p>
              </div>
              {product.size && (
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted mb-1">Size</p>
                  <p className="text-offwhite">{product.size}</p>
                </div>
              )}
              <div>
                <p className="text-xs tracking-widest uppercase text-muted mb-1">Condition</p>
                <p className="text-offwhite">{conditionLabel(product.condition)}</p>
              </div>
            </div>

            {product.condition && (
              <p className="text-xs text-muted leading-relaxed mt-3">
                {conditionDesc[product.condition]}
              </p>
            )}

            {product.description && (
              <div className="border-t border-border pt-6 mt-2">
                <p className="text-muted text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.2} className="mt-auto">
            <div className="border-t border-border pt-6">
              <AddToCartButton product={product} />
              <p className="text-center text-xs text-muted mt-4 tracking-widest">
                {product.stock > 1
                  ? `${product.stock} available`
                  : product.stock === 1
                  ? "Last piece"
                  : "Sold out"}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
