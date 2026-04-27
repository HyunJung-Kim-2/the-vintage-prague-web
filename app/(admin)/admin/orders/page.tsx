import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import TrackingUpdater from "@/components/admin/TrackingUpdater";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(quantity, price_at_purchase, product:products(name))")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-offwhite mb-8">Orders</h1>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="border border-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-offwhite font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-muted text-xs mt-1">
                  {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-offwhite">{formatPrice(order.total_amount, order.currency)}</p>
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
            <ul className="space-y-1">
              {order.order_items?.map((item: { quantity: number; price_at_purchase: number; product?: { name: string } | null }, i: number) => (
                <li key={i} className="text-muted text-sm flex justify-between">
                  <span>{item.product?.name ?? "Deleted"} × {item.quantity}</span>
                  <span>{formatPrice(item.price_at_purchase * item.quantity)}</span>
                </li>
              ))}
            </ul>
            {order.shipping_address && (
              <div className="mt-4 pt-4 border-t border-border text-xs text-muted">
                <p className="uppercase tracking-widest mb-1">Ship to</p>
                {(() => {
                  const a = order.shipping_address as { full_name?: string; line1?: string; line2?: string; city?: string; postal_code?: string; country?: string };
                  return <p>{[a.full_name, a.line1, a.line2, a.city, a.postal_code, a.country].filter(Boolean).join(", ")}</p>;
                })()}
              </div>
            )}
            <TrackingUpdater orderId={order.id} currentTracking={order.tracking_number ?? null} />
          </div>
        ))}
      </div>
    </div>
  );
}
