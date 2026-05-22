"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { invoice as t, errors } from "@/lib/content";

interface QPayQRProps {
  invoiceId: string;
  qrImageBase64: string;
  shortUrl: string;
  // Optional list of deep-link URLs returned by QPay (one per banking app).
  urls?: { name: string; description: string; logo: string; link: string }[];
}

export function QPayQR({
  invoiceId,
  qrImageBase64,
  shortUrl,
  urls = [],
}: QPayQRProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function checkNow() {
    setChecking(true);
    try {
      const res = await fetch(`/api/qpay/check?invoiceId=${invoiceId}`);
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { status: "pending" | "paid" | "failed" };
      if (data.status === "paid") {
        router.refresh();
      } else {
        toast(t.pendingTitle);
      }
    } catch (e) {
      console.error(e);
      toast.error(errors.generic);
    } finally {
      setChecking(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${qrImageBase64}`}
            alt="QPay QR"
            className="h-64 w-64 rounded-md border"
          />
        </div>

        {urls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {urls.map((u) => (
              <a
                key={u.name}
                href={u.link}
                className="flex flex-col items-center gap-1 rounded-md border p-2 text-xs hover:bg-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {u.logo ? (
                  <img src={u.logo} alt={u.name} className="h-8 w-8" />
                ) : null}
                <span className="truncate">{u.name}</span>
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="default"
            className="flex-1"
            onClick={checkNow}
            disabled={checking}
          >
            {t.checkButton}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={shortUrl} target="_blank" rel="noreferrer">
              QPay
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
