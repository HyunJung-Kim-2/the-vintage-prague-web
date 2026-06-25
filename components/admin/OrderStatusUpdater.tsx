"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "pending",   label: "Pending" },
  { value: "paid",      label: "Paid" },
  { value: "shipped",   label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const supabase = createClient();
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      aria-label="Order status"
      className="bg-surface border border-border text-offwhite text-base sm:text-xs tracking-widest uppercase px-3 py-2.5 focus:outline-none focus:border-burgundy"
    >
      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}
