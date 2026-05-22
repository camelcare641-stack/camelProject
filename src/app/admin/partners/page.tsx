import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { admin } from "@/lib/content";
import type { Partner } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("id, name, logo_url, website_url, description, sort_order")
    .order("sort_order", { ascending: true });

  const partners = (data as Partner[] | null) ?? [];

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{admin.managePartners}</h1>
      {/* TODO: add a "Шинээр нэмэх" button + create/edit dialog backed by a
          server action that validates with `partnerSchema` and writes to
          public.partners using the regular server-side Supabase client
          (admin user, RLS-authenticated). */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Тайлбар</TableHead>
              <TableHead>Веб</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.sort_order}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.description}
                </TableCell>
                <TableCell className="text-xs">{p.website_url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
