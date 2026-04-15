import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImageCarousel from "@/components/shop/ImageCarousel";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { formatPrice, categoryLabel } from "@/lib/utils";
import FadeIn from "@/components/ui/FadeIn";

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
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted mb-1">Category</p>
                <p className="text-offwhite">{categoryLabel(product.category)}</p>
              </div>
            </div>

            {product.description && (
              <div className="border-t border-border pt-6">
                <p className="text-muted text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="border-t border-border pt-6 mt-auto">
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
