"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateDonation } from "@/features/admin/actions";
import {
  DONATION_STATUSES,
  SHIPPING_STATUSES,
  type DonationUpdateInput,
} from "@/lib/validations";

const STATUS_LABELS: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  paid: "Төлсөн",
  expired: "Хугацаа дууссан",
  failed: "Амжилтгүй",
};

const SHIPPING_LABELS: Record<string, string> = {
  none: "Хүргэлтгүй",
  pending_address: "Хаяг хүлээж буй",
  addressed: "Хаяг авсан",
  shipped: "Илгээсэн",
  delivered: "Хүргэгдсэн",
};

const selectClass =
  "h-9 rounded-none border border-border bg-white px-2 text-sm text-charcoal focus-visible:border-clay focus-visible:outline-none disabled:opacity-50";

export function DonationStatusControl({
  id,
  status,
  shippingStatus,
}: {
  id: string;
  status: string;
  shippingStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<DonationUpdateInput>({
    status: status as DonationUpdateInput["status"],
    shipping_status: shippingStatus as DonationUpdateInput["shipping_status"],
  });

  function save(next: DonationUpdateInput) {
    setValue(next);
    startTransition(async () => {
      const result = await updateDonation(id, next);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Төлбөрийн төлөв"
        className={selectClass}
        value={value.status}
        disabled={pending}
        onChange={(e) => save({ ...value, status: e.target.value as DonationUpdateInput["status"] })}
      >
        {DONATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <select
        aria-label="Хүргэлтийн төлөв"
        className={selectClass}
        value={value.shipping_status}
        disabled={pending}
        onChange={(e) =>
          save({ ...value, shipping_status: e.target.value as DonationUpdateInput["shipping_status"] })
        }
      >
        {SHIPPING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {SHIPPING_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
