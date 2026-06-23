import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/shop/ProductCard";
import { categoryLabel } from "@/lib/utils";
import FadeIn from "@/components/ui/FadeIn";

const CATEGORIES = ["bags", "clothing", "shoes", "wallets"] as const;
const GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
] as const;
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
] as const;

interface SearchParams {
  category?: string;
  q?: string;
  size?: string;
  sort?: string;
  gender?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const sort = params.sort ?? "newest";

  // Build query — fetch ALL active products for size options, then filter
  let query = supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true);

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (params.category && CATEGORIES.includes(params.category as typeof CATEGORIES[number])) {
    query = query.eq("category", params.category);
  }

  if (params.gender && ["men", "women"].includes(params.gender)) {
    // Show gender-specific + unisex items
    query = query.in("gender", [params.gender, "unisex"]);
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,brand.ilike.%${params.q}%`);
  }

  const { data: allProducts } = await query;

  // Collect ALL sizes before filtering by size (so size options don't disappear)
  const allSizes = [...new Set((allProducts ?? []).map((p) => p.size).filter(Boolean))].sort();

  // Apply size filter after collecting options
  const products = params.size
    ? (allProducts ?? []).filter((p) => p.size?.toLowerCase() === params.size!.toLowerCase())
    : allProducts;

  function buildUrl(overrides: Partial<SearchParams>) {
    const merged = { ...params, ...overrides };
    const qs = new URLSearchParams();
    if (merged.category) qs.set("category", merged.category);
    if (merged.q) qs.set("q", merged.q);
    if (merged.size) qs.set("size", merged.size);
    if (merged.gender) qs.set("gender", merged.gender);
    if (merged.sort && merged.sort !== "newest") qs.set("sort", merged.sort);
    const str = qs.toString();
    return `/products${str ? `?${str}` : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-offwhite mb-2">
            {params.category ? categoryLabel(params.category) : "All Pieces"}
          </h1>
          <p className="text-muted text-sm">{products?.length ?? 0} {(products?.length ?? 0) === 1 ? "item" : "items"}</p>
        </div>

        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form method="GET" className="flex-1 max-w-md flex">
            {params.category && <input type="hidden" name="category" value={params.category} />}
            {params.size && <input type="hidden" name="size" value={params.size} />}
            {params.sort && <input type="hidden" name="sort" value={params.sort} />}
            {params.gender && <input type="hidden" name="gender" value={params.gender} />}
            <input
              name="q"
              type="text"
              defaultValue={params.q}
              placeholder="Search by name or brand..."
              className="flex-1 bg-surface border border-border text-offwhite px-4 py-2 text-sm focus:outline-none focus:border-burgundy placeholder:text-muted"
            />
            <button
              type="submit"
              className="bg-surface border border-border border-l-0 px-4 py-2 text-muted hover:text-offwhite hover:border-burgundy transition-colors text-xs tracking-widest uppercase"
            >
              Search
            </button>
          </form>

          {/* Sort */}
          <div className="flex items-center gap-2">
            {SORT_OPTIONS.map((opt) => (
              <a
                key={opt.value}
                href={buildUrl({ sort: opt.value })}
                className={`text-xs tracking-widest uppercase px-3 py-2 border transition-colors whitespace-nowrap ${
                  sort === opt.value
                    ? "border-offwhite text-offwhite"
                    : "border-border text-muted hover:border-offwhite hover:text-offwhite"
                }`}
              >
                {opt.label}
              </a>
            ))}
          </div>
        </div>

        {/* Category + Gender + Size filters */}
        <div className="flex flex-col gap-3 mb-10">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            <a
              href={buildUrl({ category: undefined })}
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
                href={buildUrl({ category: cat })}
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

          {/* Gender filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs tracking-widest uppercase text-muted mr-1">Gender</span>
            <a
              href={buildUrl({ gender: undefined })}
              className={`text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                !params.gender
                  ? "border-offwhite text-offwhite"
                  : "border-border text-muted hover:border-offwhite hover:text-offwhite"
              }`}
            >
              All
            </a>
            {GENDERS.map((g) => (
              <a
                key={g.value}
                href={buildUrl({ gender: g.value })}
                className={`text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                  params.gender === g.value
                    ? "border-offwhite text-offwhite"
                    : "border-border text-muted hover:border-offwhite hover:text-offwhite"
                }`}
              >
                {g.label}
              </a>
            ))}
          </div>

          {/* Size filter — always shows all available sizes */}
          {allSizes.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs tracking-widest uppercase text-muted mr-1">Size</span>
              {params.size && (
                <a
                  href={buildUrl({ size: undefined })}
                  className="text-xs tracking-widest uppercase px-3 py-1.5 border border-offwhite text-offwhite"
                >
                  {params.size} ×
                </a>
              )}
              {allSizes.filter((s) => s !== params.size).map((size) => (
                <a
                  key={size}
                  href={buildUrl({ size: size! })}
                  className="text-xs tracking-widest uppercase px-3 py-1.5 border border-border text-muted hover:border-offwhite hover:text-offwhite transition-colors"
                >
                  {size}
                </a>
              ))}
            </div>
          )}
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
