import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/shop/ProductCard";
import { categoryLabel } from "@/lib/utils";
import FadeIn from "@/components/ui/FadeIn";

const CATEGORIES = ["bags", "clothing", "shoes", "wallets"] as const;

interface SearchParams {
  category?: string;
  q?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (params.category && CATEGORIES.includes(params.category as typeof CATEGORIES[number])) {
    query = query.eq("category", params.category);
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,brand.ilike.%${params.q}%`);
  }

  const { data: products } = await query;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-offwhite mb-2">
            {params.category ? categoryLabel(params.category) : "All Pieces"}
          </h1>
          <p className="text-muted text-sm">{products?.length ?? 0} items</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Search */}
        <form method="GET" className="flex-1 max-w-md">
          {params.category && <input type="hidden" name="category" value={params.category} />}
          <input
            name="q"
            type="text"
            defaultValue={params.q}
            placeholder="Search by name or brand..."
            className="w-full bg-surface border border-border text-offwhite px-4 py-2 text-sm focus:outline-none focus:border-burgundy placeholder:text-muted"
          />
        </form>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          <a
            href="/products"
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              !params.category
                ? "border-offwhite text-offwhite"
                : "border-border text-muted hover:border-offwhite hover:text-offwhite"
            }`}
          >
            All
          </a>
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/products?category=${cat}`}
              className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
                params.category === cat
                  ? "border-offwhite text-offwhite"
                  : "border-border text-muted hover:border-offwhite hover:text-offwhite"
              }`}
            >
              {categoryLabel(cat)}
            </a>
          ))}
        </div>
      </div>
      </FadeIn>

      {/* Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={Math.min(i * 0.06, 0.3)}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-offwhite mb-4">No pieces found</p>
          <p className="text-muted text-sm">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
