import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/shop/ProductCard";

const categories = [
  { name: "Bags", slug: "bags", description: "Timeless carriers" },
  { name: "Clothing", slug: "clothing", description: "Wearable history" },
  { name: "Shoes", slug: "shoes", description: "Walk with heritage" },
  { name: "Wallets", slug: "wallets", description: "Pocket elegance" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: newArrivals } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="relative text-center px-4">
          <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Prague, Czech Republic</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-burgundy-vivid mb-8 leading-none">
            The Vintage<br />Prague
          </h1>
          <p className="text-muted text-sm tracking-widest uppercase mb-10">
            Curated vintage fashion — each piece, a story
          </p>
          <Link
            href="/products"
            className="inline-block border border-offwhite/60 text-offwhite text-xs tracking-[0.12em] uppercase px-10 py-4 rounded-full hover:border-offwhite hover:tracking-[0.16em] transition-all duration-300 ease-out"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <p className="text-xs tracking-[0.4em] uppercase text-muted text-center mb-12">
          Shop by Category
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-square bg-surface flex flex-col items-center justify-center border border-border hover:border-burgundy transition-colors"
            >
              <p className="font-serif text-2xl text-offwhite mb-1">{cat.name}</p>
              <p className="text-xs text-muted tracking-widest">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex items-center justify-between mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-muted">New Arrivals</p>
            <Link href="/products" className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
