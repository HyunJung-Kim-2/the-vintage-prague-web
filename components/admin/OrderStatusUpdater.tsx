"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

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
      className="bg-surface border border-border text-offwhite text-xs tracking-widest uppercase px-3 py-2 focus:outline-none focus:border-burgundy"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
