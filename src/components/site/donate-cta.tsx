"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DonateModal } from "@/features/donate/components/donate-modal";
import { cn } from "@/lib/utils";
import { cta } from "@/lib/content";

type Props = {
  variant?: "cta" | "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  label?: string;
  fullWidth?: boolean;
  /** Pre-fills the donate modal's amount (e.g. from the camel calculator). */
  initialAmount?: number;
};

/**
 * Shared "Хандив өгөх" CTA. Opens the donate modal anywhere in the app.
 * When the donor clicks "Дансаар шилжүүлэх" inside the modal, navigates
 * to /donate (or scrolls to #donate when already on the home page).
 */
export function DonateCTA({
  variant = "cta",
  size = "default",
  className,
  label,
  fullWidth = false,
  initialAmount,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function handleBankFallback() {
    setOpen(false);
    if (pathname === "/") {
      // Scroll to §5 once the modal close animation has settled.
      setTimeout(() => {
        document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" });
      }, 220);
    } else {
      router.push("/donate#donate");
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn(fullWidth && "w-full", className)}
      >
        {label ?? cta.donate}
      </Button>
      <DonateModal
        open={open}
        onOpenChange={setOpen}
        onBankFallback={handleBankFallback}
        initialAmount={initialAmount}
      />
    </>
  );
}
