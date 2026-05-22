import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { admin } from "@/lib/content";
import type { Campaign } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminCampaignPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaign")
    .select(
      "id, title, description, story, goals, advantages, goal_amount, bank_account_info, created_at",
    )
    .limit(1)
    .maybeSingle();

  const campaign = data as Campaign | null;

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{admin.manageCampaign}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{campaign?.title ?? "—"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {/* TODO: server action + form to edit campaign fields (title,
              description, story, goals[], advantages[], goal_amount,
              bank_account_info). Validate with campaignSchema. */}
          <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(campaign, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}
