import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { Resend } from "resend";
import type Stripe from "stripe";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

      // Send order confirmation email
      const customerEmail = session.customer_details?.email ?? session.customer_email;
      if (resend && customerEmail) {
        const itemsHtml = itemsRaw
          .map((i) => `<tr><td style="padding:4px 0;color:#a0a0a0;">Item</td><td style="padding:4px 0;color:#f0f0f0;text-align:right;">€${i.price.toFixed(2)}</td></tr>`)
          .join("");
        const total = ((session.amount_total ?? 0) / 100).toFixed(2);
        const orderId = order.id.slice(0, 8).toUpperCase();

        await resend.emails.send({
          from: "The Vintage Prague <orders@thevintageprague.com>",
          to: customerEmail,
          subject: `Order confirmed — #${orderId}`,
          html: `
            <div style="background:#0f0f0f;color:#f0f0f0;font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:48px 32px;">
              <p style="font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#666;margin:0 0 24px;">The Vintage Prague</p>
              <h1 style="font-size:28px;font-weight:400;margin:0 0 8px;">Order Confirmed</h1>
              <p style="color:#888;font-size:13px;margin:0 0 32px;">Thank you for your purchase.</p>
              <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
                ${itemsHtml}
                <tr style="border-top:1px solid #333;">
                  <td style="padding:12px 0 4px;color:#a0a0a0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Total</td>
                  <td style="padding:12px 0 4px;color:#f0f0f0;text-align:right;">€${total}</td>
                </tr>
              </table>
              <p style="color:#666;font-size:11px;margin:32px 0 0;">Order #${orderId} · Truhlářská 1110/4, Prague 1</p>
            </div>
          `,
        });
      }

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
