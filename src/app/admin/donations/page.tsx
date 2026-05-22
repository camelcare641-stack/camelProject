import { DonationsTable } from "@/components/admin/donations-table";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { admin } from "@/lib/content";
import type { Donation } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminDonationsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select(
      "id, donor_name, donor_email, donor_phone, amount, message, is_anonymous, qpay_invoice_id, qpay_payment_id, status, created_at, paid_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const donations = (data as Donation[] | null) ?? [];

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{admin.manageDonations}</h1>
      <div className="rounded-md border">
        <DonationsTable donations={donations} />
      </div>
    </section>
  );
}
