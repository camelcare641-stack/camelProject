import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonorTicker } from "@/components/public/donor-ticker";
import { ProgressBar } from "@/components/public/progress-bar";
import { createClient } from "@/lib/supabase/server";
import { home, site } from "@/lib/content";
import type {
  BankAccountInfo,
  Campaign,
  CampaignStats,
  PublicDonation,
} from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const [campaignRes, statsRes, donationsRes] = await Promise.all([
    supabase
      .from("campaign")
      .select(
        "id, title, description, story, goals, advantages, goal_amount, bank_account_info, created_at",
      )
      .limit(1)
      .maybeSingle(),
    supabase
      .from("campaign_stats")
      .select("total_raised, donor_count, goal_amount")
      .maybeSingle(),
    supabase
      .from("public_donations")
      .select("donor_name, amount, message, paid_at")
      .order("paid_at", { ascending: false })
      .limit(30),
  ]);

  const campaign = (campaignRes.data as Campaign | null) ?? null;
  const stats: CampaignStats = (statsRes.data as CampaignStats | null) ?? {
    total_raised: 0,
    donor_count: 0,
    goal_amount: campaign?.goal_amount ?? 0,
  };
  const donations = (donationsRes.data as PublicDonation[] | null) ?? [];
  const bank: BankAccountInfo | null = campaign?.bank_account_info ?? null;

  return (
    <>
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">
            {campaign?.title ?? site.tagline}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {campaign?.description ?? site.description}
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/donate">{home.heroCtaDonate}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#story">{home.heroCtaLearn}</Link>
            </Button>
          </div>
        </div>

        <ProgressBar initial={stats} />
      </section>

      <DonorTicker initial={donations} />

      <section id="story" className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <article className="prose prose-neutral max-w-none whitespace-pre-line">
          {campaign?.story}
        </article>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{home.goalsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm">
              {(campaign?.goals ?? []).map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{home.advantagesTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm">
              {(campaign?.advantages ?? []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {bank ? (
        <section className="mx-auto max-w-3xl px-4 pb-16">
          <Card>
            <CardHeader>
              <CardTitle>{home.bankAccountTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">
                  {home.bankName}
                </div>
                <div className="font-medium">{bank.bank_name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {home.accountNumber}
                </div>
                <div className="font-mono font-medium">
                  {bank.account_number}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground">
                  {home.accountHolder}
                </div>
                <div className="font-medium">{bank.account_holder}</div>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </>
  );
}
