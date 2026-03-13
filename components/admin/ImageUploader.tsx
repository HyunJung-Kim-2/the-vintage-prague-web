"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
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
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
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
      const path = `${productId}/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });
      if (error) { alert(error.message); continue; }
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(data.path);
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
    if (!img.id) return;
    await supabase.from("product_images").delete().eq("id", img.id);
    const path = new URL(img.url).pathname.split("/product-images/")[1];
    await supabase.storage.from("product-images").remove([path]);
    setImages((prev) => prev.filter((i) => i.url !== img.url).map((i, idx) => ({ ...i, position: idx })));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
        {images.map((img, i) => (
          <div key={img.url} className="relative aspect-square group">
            <Image src={img.url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(img)}
              className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
            <span className="absolute top-1 left-1 text-[10px] bg-background/70 px-1">{i + 1}</span>
          </div>
        ))}
        {images.length < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-border flex items-center justify-center text-muted hover:border-offwhite hover:text-offwhite transition-colors disabled:opacity-50"
          >
            {uploading ? "..." : <Upload size={20} />}
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
      <p className="text-xs text-muted">{images.length}/10 images</p>
    </div>
  );
}
