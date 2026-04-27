import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import type Stripe from "stripe";

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const itemsRaw = JSON.parse(metadata.items ?? "[]") as {
      id: string;
      qty: number;
      price: number;
    }[];

    const { data: order } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: metadata.user_id || null,
        stripe_session_id: session.id,
        status: "paid",
        total_amount: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? "eur").toUpperCase(),
        shipping_address: session.collected_information?.shipping_details?.address ?? null,
      })
      .select()
      .single();

    if (order && itemsRaw.length > 0) {
      await supabaseAdmin.from("order_items").insert(
        itemsRaw.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_purchase: item.price,
        }))
      );

      for (const item of itemsRaw) {
        await supabaseAdmin.rpc("decrement_stock", {
          product_id: item.id,
          qty: item.qty,
        });

        // Auto-deactivate when stock hits 0 (vintage shop: one item = sold out)
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        if (product && product.stock === 0) {
          await supabaseAdmin
            .from("products")
            .update({ is_active: false })
            .eq("id", item.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
