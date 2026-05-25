"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteNews } from "@/features/admin/actions";

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!window.confirm(`"${title}" мэдээг устгах уу?`)) return;
    startTransition(async () => {
      const result = await deleteNews(id);
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
      {pending ? "…" : "Устгах"}
    </Button>
  );
}
