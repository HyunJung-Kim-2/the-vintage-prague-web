"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "./ImageUploader";
import type { Product } from "@/types/database";

const CATEGORIES = ["bags", "clothing", "shoes", "wallets"] as const;
const CONDITIONS = [
  { value: "new", label: "New — Brand new, never worn" },
  { value: "s",   label: "S Grade — Like new, minimal signs of use" },
  { value: "a",   label: "A Grade — Gently used, light wear" },
  { value: "b",   label: "B Grade — Visible wear, minor flaws" },
] as const;
const GENDERS = [
  { value: "unisex", label: "Unisex" },
  { value: "men",    label: "Men" },
  { value: "women",  label: "Women" },
] as const;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name:        product?.name ?? "",
    slug:        product?.slug ?? "",
    description: product?.description ?? "",
    brand:       product?.brand ?? "",
    category:    product?.category ?? "bags",
    condition:   product?.condition ?? "a",
    price:       product?.price?.toString() ?? "",
    size:        product?.size ?? "",
    gender:      product?.gender ?? "unisex",
    color:       product?.color ?? "",
    stock:       product?.stock?.toString() ?? "1",
    is_active:   product?.is_active ?? true,
  });

  const [measurements, setMeasurements] = useState({
    shoulder: product?.measurements?.shoulder ?? "",
    chest:    product?.measurements?.chest ?? "",
    waist:    product?.measurements?.waist ?? "",
    hips:     product?.measurements?.hips ?? "",
    length:   product?.measurements?.length ?? "",
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

  function handleMeasurement(e: React.ChangeEvent<HTMLInputElement>) {
    setMeasurements((m) => ({ ...m, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hasMeasurements = Object.values(measurements).some((v) => v.trim() !== "");
    const measurementsPayload = hasMeasurements
      ? Object.fromEntries(Object.entries(measurements).filter(([, v]) => v.trim() !== ""))
      : null;

    const payload = {
      id:           productId,
      name:         form.name,
      slug:         form.slug,
      description:  form.description || null,
      brand:        form.brand || null,
      category:     form.category,
      condition:    form.condition,
      price:        parseFloat(form.price),
      size:         form.size || null,
      gender:       form.gender,
      color:        form.color || null,
      measurements: measurementsPayload,
      stock:        parseInt(form.stock),
      is_active:    form.is_active,
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

      {/* Basic info */}
      <div className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-muted border-b border-border pb-2">Basic Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className={inputClass} placeholder="e.g. Yohji Yamamoto" />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Condition notes, styling details, provenance..." />
        </div>
      </div>

      {/* Condition & Details */}
      <div className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-muted border-b border-border pb-2">Condition & Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Condition *</label>
            <select name="condition" value={form.condition} onChange={handleChange} className={inputClass}>
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Size</label>
            <input name="size" value={form.size} onChange={handleChange} className={inputClass} placeholder="e.g. M, 38, One Size" />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <input name="color" value={form.color} onChange={handleChange} className={inputClass} placeholder="e.g. Black, Olive, Ecru" />
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-muted border-b border-border pb-2">Measurements <span className="normal-case text-muted/50">(cm, optional)</span></p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["shoulder", "chest", "waist", "hips", "length"] as const).map((key) => (
            <div key={key}>
              <label className={labelClass}>{key}</label>
              <input
                name={key}
                value={measurements[key]}
                onChange={handleMeasurement}
                className={inputClass}
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-muted border-b border-border pb-2">Pricing & Stock</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (EUR) *</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stock *</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="accent-burgundy" />
          <label htmlFor="is_active" className="text-sm text-offwhite">Active (visible to customers)</label>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-muted border-b border-border pb-2">Images <span className="normal-case text-muted/50">(max 10, drag to reorder)</span></p>
        <ImageUploader
          productId={productId}
          initialImages={product?.product_images?.map((img) => ({ id: img.id, url: img.url, position: img.position })) ?? []}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-burgundy text-offwhite px-8 py-3 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50">
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="border border-red-800 text-red-400 px-6 py-3 text-xs tracking-widest uppercase hover:bg-red-950 transition-colors">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
