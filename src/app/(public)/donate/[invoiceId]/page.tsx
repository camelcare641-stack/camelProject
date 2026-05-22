import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QPayQR } from "@/components/public/qpay-qr";
import { createClient } from "@/lib/supabase/server";
import { invoice as t } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { invoiceId } = await params;
  const supabase = await createClient();

  // Reading donations requires admin (RLS). For the public invoice page we
  // expose only the minimal fields the donor needs. TODO: replace this with
  // an RPC or a server action that returns ONLY {status, amount} so we don't
  // leak donor PII through a misconfigured client.
  const { data, error } = await supabase
    .from("donations")
    .select("id, status, amount, qpay_invoice_id")
    .eq("qpay_invoice_id", invoiceId)
    .maybeSingle();

  if (error || !data) notFound();
  const donation = data as {
    id: string;
    status: "pending" | "paid" | "failed";
    amount: number;
    qpay_invoice_id: string | null;
  };

  if (donation.status === "paid") {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t.paidTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t.paidSubtitle}</p>
            <div className="text-3xl font-bold">{formatMNT(donation.amount)}</div>
            <Button asChild>
              <Link href="/">{t.backHome}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (donation.status === "failed") {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t.failedTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/donate">{t.backHome}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Pending — show the QR.
  // TODO: re-fetch invoice details (qr_image, qPay_shortUrl, urls) from QPay
  // here using `GET /v2/invoice/{invoiceId}` or by caching the QR on the
  // donation row when the invoice is first created. The placeholders below
  // keep the page renderable while you wire that up.
  const qrImageBase64 = "";
  const shortUrl = `https://qpay.mn`;
  const urls: { name: string; description: string; logo: string; link: string }[] = [];

  return (
    <section className="mx-auto max-w-md space-y-6 px-4 py-12">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        <div className="pt-2 text-lg font-semibold">
          {formatMNT(donation.amount)}
        </div>
      </div>
      <QPayQR
        invoiceId={invoiceId}
        qrImageBase64={qrImageBase64}
        shortUrl={shortUrl}
        urls={urls}
      />
    </section>
  );
}
