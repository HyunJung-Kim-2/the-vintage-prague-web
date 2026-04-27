"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Address } from "@/types/database";
import { Plus, Trash2 } from "lucide-react";

const BLANK_FORM = {
  label: "",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postal_code: "",
  country: "",
  is_default: false,
};

export default function AddressManager({
  initialAddresses,
  userId,
}: {
  initialAddresses: Address[];
  userId: string;
}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...form, user_id: userId, line2: form.line2 || null })
      .select()
      .single();
    if (!error && data) {
      setAddresses((prev) => [data, ...prev]);
      setForm(BLANK_FORM);
      setShowForm(false);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleSetDefault(id: string) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  }

  const inputClass = "w-full bg-surface border border-border text-offwhite px-3 py-2 text-sm focus:outline-none focus:border-burgundy";
  const labelClass = "block text-xs tracking-widest uppercase text-muted mb-1";

  return (
    <div>
      <div className="space-y-3 mb-6">
        {addresses.length === 0 && (
          <p className="text-muted text-sm">No saved addresses.</p>
        )}
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-border p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-offwhite text-sm">{addr.full_name}</p>
              <p className="text-muted text-xs mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city} {addr.postal_code}, {addr.country}</p>
              {(addr as Address & { phone?: string }).phone && <p className="text-muted text-xs mt-0.5">{(addr as Address & { phone?: string }).phone}</p>}
              {addr.label && <p className="text-xs text-muted mt-1 uppercase tracking-widest">{addr.label}</p>}
              {addr.is_default && (
                <span className="mt-2 inline-block text-xs tracking-widest uppercase border border-burgundy text-burgundy px-2 py-0.5">Default</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs text-muted hover:text-offwhite tracking-widest uppercase transition-colors"
                >
                  Set default
                </button>
              )}
              <button onClick={() => handleDelete(addr.id)} className="text-muted hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors"
        >
          <Plus size={14} />
          Add address
        </button>
      ) : (
        <form onSubmit={handleAdd} className="border border-border p-6 space-y-4 max-w-lg">
          <p className="font-serif text-offwhite mb-2">New Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Label</label>
              <input name="label" value={form.label} onChange={handleChange} placeholder="Home, Work..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Full Name *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} type="tel" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address Line 1 *</label>
              <input name="line1" value={form.line1} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address Line 2</label>
              <input name="line2" value={form.line2} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>City *</label>
              <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Postal Code *</label>
              <input name="postal_code" value={form.postal_code} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <input name="country" value={form.country} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_default" id="is_default" checked={form.is_default} onChange={handleChange} className="accent-burgundy" />
            <label htmlFor="is_default" className="text-sm text-offwhite">Set as default</label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-burgundy text-offwhite px-6 py-2 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(BLANK_FORM); }}
              className="text-xs tracking-widest uppercase text-muted hover:text-offwhite transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
