"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "./ImageUploader";
import type { Product } from "@/types/database";

const CATEGORIES = ["bags", "clothing", "shoes", "wallets"] as const;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "bags",
    price: product?.price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "1",
    is_active: product?.is_active ?? true,
  });
  const [productId] = useState(product?.id ?? crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      ...(name === "name" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: productId,
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      brand: form.brand || null,
      category: form.category,
      condition: "a",
      price: parseFloat(form.price),
      size: null,
      stock: parseInt(form.stock),
      is_active: form.is_active,
    };

    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").delete().eq("id", product!.id);
    router.push("/admin/products");
    router.refresh();
  }

  const inputClass = "w-full bg-surface border border-border text-offwhite px-3 py-2 text-sm focus:outline-none focus:border-burgundy";
  const labelClass = "block text-xs tracking-widest uppercase text-muted mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Price (EUR) *</label>
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock *</label>
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="accent-burgundy"
        />
        <label htmlFor="is_active" className="text-sm text-offwhite">Active (visible to customers)</label>
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Images (max 10)</label>
        <ImageUploader
          productId={productId}
          initialImages={product?.product_images?.map((img) => ({ id: img.id, url: img.url, position: img.position })) ?? []}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-burgundy text-offwhite px-8 py-3 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="border border-red-800 text-red-400 px-6 py-3 text-xs tracking-widest uppercase hover:bg-red-950 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
