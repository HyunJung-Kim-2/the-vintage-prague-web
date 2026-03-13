import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(name))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-offwhite mb-8">Order History</h1>
      {!orders?.length ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted tracking-widest uppercase">
                    {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-offwhite text-sm font-mono mt-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs tracking-widest uppercase px-2 py-1 border ${
                    order.status === "delivered" ? "border-green-700 text-green-400" :
                    order.status === "shipped" ? "border-blue-700 text-blue-400" :
                    order.status === "paid" ? "border-burgundy text-burgundy" :
                    "border-border text-muted"
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-offwhite mt-2">{formatPrice(order.total_amount, order.currency as "EUR" | "CZK")}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {order.order_items?.map((item: { id: string; quantity: number; price_at_purchase: number; product?: { name: string } | null }) => (
                  <li key={item.id} className="text-muted text-sm">
                    {item.product?.name ?? "Deleted item"} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
