import { createClient } from "@/lib/supabase/server";
import AddressManager from "@/components/shop/AddressManager";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user!.id)
    .order("is_default", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-offwhite mb-8">My Account</h1>
      <div className="mb-4">
        <p className="text-xs text-muted tracking-widest uppercase">Email</p>
        <p className="text-offwhite mt-1">{user?.email}</p>
      </div>
      <div className="mt-10">
        <h2 className="font-serif text-xl text-offwhite mb-6">Saved Addresses</h2>
        <AddressManager initialAddresses={addresses ?? []} userId={user!.id} />
      </div>
    </div>
  );
}
