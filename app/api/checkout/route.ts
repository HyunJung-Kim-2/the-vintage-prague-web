import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types/database";

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const lineItems = items.map(({ product, quantity }) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: product.name,
        description: product.brand ?? undefined,
        images: product.product_images?.[0]
          ? [product.product_images[0].url]
          : undefined,
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: user?.email ?? undefined,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    metadata: {
      user_id: user?.id ?? "",
      items: JSON.stringify(
        items.map((i) => ({
          id: i.product.id,
          qty: i.quantity,
          price: i.product.price,
        }))
      ),
    },
    shipping_address_collection: {
      allowed_countries: [
        "CZ", "SK", "DE", "AT", "PL", "HU", "FR", "IT", "ES", "GB", "NL", "BE",
      ],
    },
  });

  return NextResponse.json({ url: session.url });
}
