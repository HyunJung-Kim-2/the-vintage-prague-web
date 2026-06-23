"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Trash2, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UploadedImage {
  id?: string;
  url: string;
  position: number;
}

export default function ImageUploader({
  productId,
  initialImages = [],
}: {
  productId: string;
  initialImages?: UploadedImage[];
}) {
  const [images, setImages] = useState<UploadedImage[]>(
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleUpload(files: FileList) {
    if (images.length + files.length > 10) {
      alert("Maximum 10 images per product");
      return;
    }
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("product-image")
        .upload(path, file, { upsert: false });
      if (error) { alert(error.message); continue; }
      const { data: { publicUrl } } = supabase.storage.from("product-image").getPublicUrl(data.path);
      const position = images.length;
      const { data: imgRow } = await supabase
        .from("product_images")
        .insert({ product_id: productId, url: publicUrl, position })
        .select()
        .single();
      if (imgRow) setImages((prev) => [...prev, { id: imgRow.id, url: publicUrl, position }]);
    }
    setUploading(false);
  }

  async function handleDelete(img: UploadedImage) {
    if (!img.id || busy) return;
    setBusy(true);
    await supabase.from("product_images").delete().eq("id", img.id);
    try {
      const path = new URL(img.url).pathname.split("/product-image/")[1];
      if (path) await supabase.storage.from("product-image").remove([path]);
    } catch { /* ignore storage cleanup errors */ }
    const next = images.filter((i) => i.url !== img.url).map((i, idx) => ({ ...i, position: idx }));
    setImages(next);
    await persistOrder(next);
    setBusy(false);
  }

  // Persist each image's position to match its array index
  async function persistOrder(list: UploadedImage[]) {
    await Promise.all(
      list.map((img) =>
        img.id ? supabase.from("product_images").update({ position: img.position }).eq("id", img.id) : null
      )
    );
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length || busy) return;
    setBusy(true);
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    const reindexed = next.map((img, idx) => ({ ...img, position: idx }));
    setImages(reindexed);
    await persistOrder(reindexed);
    setBusy(false);
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
        {images.map((img, i) => (
          <div key={img.url} className="relative aspect-square border border-border overflow-hidden">
            <Image src={img.url} alt="" fill className="object-cover" />

            {/* Cover badge on first image, position number otherwise */}
            {i === 0 ? (
              <span className="absolute top-1 left-1 text-[9px] tracking-wider uppercase bg-burgundy text-offwhite px-1.5 py-0.5">
                Cover
              </span>
            ) : (
              <span className="absolute top-1 left-1 text-[10px] bg-background/70 text-offwhite px-1.5 py-0.5">{i + 1}</span>
            )}

            {/* Always-visible delete (works on touch, not hover-only) */}
            <button
              type="button"
              onClick={() => handleDelete(img)}
              disabled={busy}
              aria-label="Delete image"
              className="absolute top-1 right-1 bg-background/80 p-1 text-red-400 hover:bg-background disabled:opacity-50"
            >
              <Trash2 size={13} />
            </button>

            {/* Reorder controls along the bottom */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between bg-background/70">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0 || busy}
                aria-label="Move left"
                className="p-1.5 text-offwhite disabled:opacity-25"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1 || busy}
                aria-label="Move right"
                className="p-1.5 text-offwhite disabled:opacity-25"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {images.length < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted hover:border-offwhite hover:text-offwhite transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-xs">Uploading…</span>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-[10px] tracking-wider uppercase">Add</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />
      <p className="text-xs text-muted">{images.length}/10 images · first photo is the cover</p>
    </div>
  );
}
