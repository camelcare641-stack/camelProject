import { StatsCards } from "@/components/admin/stats-cards";
import { DonationsTable } from "@/components/admin/donations-table";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { admin } from "@/lib/content";
import type { Donation } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [statsRes, recentRes] = await Promise.all([
    supabase
      .from("campaign_stats")
      .select("total_raised, donor_count, goal_amount")
      .maybeSingle(),
    supabase
      .from("donations")
      .select(
        "id, donor_name, donor_email, donor_phone, amount, message, is_anonymous, qpay_invoice_id, qpay_payment_id, status, created_at, paid_at",
      )
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const stats = statsRes.data ?? {
    total_raised: 0,
    donor_count: 0,
    goal_amount: 0,
  };
  const recent = (recentRes.data as Donation[] | null) ?? [];

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <h1 className="text-2xl font-bold">{admin.dashboardTitle}</h1>
      <StatsCards
        totalRaised={stats.total_raised}
        totalDonations={stats.donor_count}
        donorCount={stats.donor_count}
      />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{admin.manageDonations}</h2>
        <div className="rounded-md border">
          <DonationsTable donations={recent} />
        </div>
      </div>
    </section>
  );
}
