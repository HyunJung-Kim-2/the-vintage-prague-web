import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, categoryLabel, conditionLabel } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(url, position)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-offwhite">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-burgundy text-offwhite px-4 py-2 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {products?.map((product) => (
          <Link key={product.id} href={`/admin/products/${product.id}`} className="block border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-offwhite text-sm">{product.name}</p>
                <p className="text-muted text-xs mt-1">{categoryLabel(product.category)} · {conditionLabel(product.condition)}</p>
              </div>
              <div className="text-right">
                <p className="text-offwhite text-sm">{formatPrice(product.price)}</p>
                <p className={`text-xs mt-1 ${product.is_active ? "text-green-400" : "text-muted"}`}>
                  {product.is_active ? "Active" : "Hidden"} · {product.stock} left
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="text-xs tracking-widest uppercase text-muted pb-3 pr-4">Name</th>
              <th className="text-xs tracking-widest uppercase text-muted pb-3 pr-4">Category</th>
              <th className="text-xs tracking-widest uppercase text-muted pb-3 pr-4">Condition</th>
              <th className="text-xs tracking-widest uppercase text-muted pb-3 pr-4">Price</th>
              <th className="text-xs tracking-widest uppercase text-muted pb-3 pr-4">Stock</th>
              <th className="text-xs tracking-widest uppercase text-muted pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-surface transition-colors">
                <td className="py-3 pr-4">
                  <Link href={`/admin/products/${product.id}`} className="text-offwhite hover:text-burgundy transition-colors">
                    {product.name}
                  </Link>
                  {product.brand && <p className="text-muted text-xs">{product.brand}</p>}
                </td>
                <td className="py-3 pr-4 text-muted">{categoryLabel(product.category)}</td>
                <td className="py-3 pr-4 text-muted">{conditionLabel(product.condition)}</td>
                <td className="py-3 pr-4 text-offwhite">{formatPrice(product.price)}</td>
                <td className="py-3 pr-4 text-offwhite">{product.stock}</td>
                <td className="py-3">
                  <span className={`text-xs tracking-widest uppercase ${product.is_active ? "text-green-400" : "text-muted"}`}>
                    {product.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
