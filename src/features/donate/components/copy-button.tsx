"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cta } from "@/lib/content";

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const isPlaceholder = value.startsWith("[REPLACE");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Хууллаа");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Хуулж чадсангүй");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPlaceholder}
      onClick={copy}
      aria-label={label ?? cta.copy}
      title={isPlaceholder ? "Дансны дугаар хараахан тохируулагдаагүй" : undefined}
    >
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      {copied ? cta.copied : cta.copy}
    </Button>
  );
}
