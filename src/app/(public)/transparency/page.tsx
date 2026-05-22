import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { transparency as t, anonymous } from "@/lib/content";
import { formatDate, formatMNT } from "@/lib/utils";
import type { PublicDonation } from "@/types/database";

export const metadata = { title: t.title };
export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_donations")
    .select("donor_name, amount, message, paid_at")
    .order("paid_at", { ascending: false })
    .limit(500);
  const donations = (data as PublicDonation[] | null) ?? [];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {donations.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{t.empty}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.dateColumn}</TableHead>
                <TableHead>{t.donorColumn}</TableHead>
                <TableHead className="text-right">{t.amountColumn}</TableHead>
                <TableHead>{t.messageColumn}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((d, i) => (
                <TableRow key={`${d.paid_at}-${i}`}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(d.paid_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {d.donor_name || anonymous}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatMNT(d.amount)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {d.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
