"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { site } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

export function Calculator() {
  const [qty, setQty] = useState(1);
  const total = qty * site.unitPrice;
  return (
    <Card className="rounded-none border-border bg-white shadow-none">
      <CardContent className="p-6 sm:p-7">
        <p className="eyebrow">Тооцоологч</p>
        <p className="mt-2 text-base text-charcoal">
          Та хэдэн &ldquo;Тэмээ&rdquo; авах вэ?
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Хасах"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <MinusIcon className="size-4" />
          </Button>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={999}
            value={qty}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              setQty(Number.isFinite(n) ? Math.min(999, Math.max(1, n)) : 1);
            }}
            aria-label="Тэмээний тоо"
            className="h-11 w-20 rounded-none border-border bg-white text-center font-display text-2xl font-bold text-charcoal [appearance:textfield] focus-visible:border-clay focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Нэмэх"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
          >
            <PlusIcon className="size-4" />
          </Button>
          <span className="ml-1 text-sm text-charcoal-muted">тэмээ</span>
        </div>
        <dl className="mt-6 flex items-baseline justify-between gap-2 border-t border-border pt-5">
          <dt className="text-xs uppercase tracking-[0.15em] text-charcoal-muted">
            Нийт
          </dt>
          <dd className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
            {formatMNT(total)}
          </dd>
        </dl>
        <p className="mt-2 text-xs text-charcoal-muted">
          Та {qty} хүүхдийн боломжийг бүтээж байна.
        </p>
      </CardContent>
    </Card>
  );
}
