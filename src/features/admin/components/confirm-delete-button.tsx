"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/types";

/**
 * Generic confirm-before-delete button. Parent binds the server action, e.g.
 * `action={deletePartner.bind(null, id)}`.
 */
export function ConfirmDeleteButton({
  action,
  confirmText,
  label = "Устгах",
}: {
  action: () => Promise<ActionResult>;
  confirmText: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!window.confirm(confirmText)) return;
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={onClick}
      className="text-destructive hover:border-destructive hover:bg-destructive/5"
    >
      {pending ? "…" : label}
    </Button>
  );
}
