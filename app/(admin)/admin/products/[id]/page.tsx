import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-offwhite mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
