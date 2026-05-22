import { PartnerGrid } from "@/components/public/partner-grid";
import { createClient } from "@/lib/supabase/server";
import { partners as t } from "@/lib/content";
import type { Partner } from "@/types/database";

export const metadata = { title: t.title };
export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("id, name, logo_url, website_url, description, sort_order")
    .order("sort_order", { ascending: true });

  const partners = (data as Partner[] | null) ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>
      <PartnerGrid partners={partners} />
    </section>
  );
}
