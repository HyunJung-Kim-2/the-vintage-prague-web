"use client";

import { useState } from "react";

export default function TrackingUpdater({
  orderId,
  currentTracking,
}: {
  orderId: string;
  currentTracking: string | null;
}) {
  const [value, setValue] = useState(currentTracking ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}/tracking`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_number: value }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
      <span className="text-xs tracking-widest uppercase text-muted shrink-0">Tracking</span>
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        placeholder="Enter tracking number..."
        className="flex-1 bg-surface border border-border text-offwhite px-3 py-1.5 text-xs focus:outline-none focus:border-burgundy placeholder:text-muted/50"
      />
      <button
        onClick={save}
        disabled={saving}
        className="text-xs tracking-widest uppercase px-3 py-1.5 border border-border text-muted hover:border-offwhite hover:text-offwhite transition-colors disabled:opacity-40 shrink-0"
      >
        {saving ? "..." : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
