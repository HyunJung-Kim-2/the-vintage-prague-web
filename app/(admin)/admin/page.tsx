import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Active Products", value: productCount ?? 0 },
    { label: "Paid Orders", value: orderCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-offwhite mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-6">
            <p className="text-xs tracking-widest uppercase text-muted mb-2">{s.label}</p>
            <p className="font-serif text-3xl text-offwhite">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-lg text-offwhite mb-4">Recent Orders</h2>
      <div className="space-y-2">
        {recentOrders?.map((order) => (
          <div key={order.id} className="flex items-center justify-between border border-border px-4 py-3">
            <p className="text-sm text-offwhite font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs uppercase tracking-widest text-muted">{order.status}</p>
            <p className="text-sm text-offwhite">{formatPrice(order.total_amount, order.currency)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
