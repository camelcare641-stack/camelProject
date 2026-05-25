"use client";

import { useCallback, useState, useTransition } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDonationInvoice } from "@/features/donate/actions";
import { useDonationStatus } from "@/features/donate/hooks/use-donation-status";
import { donationSchema, type DonationInput } from "@/lib/validations";
import { cta, modal, site } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

type ModalState =
  | { kind: "form" }
  | {
      kind: "pending";
      donationId: string;
      qrImage: string;
      amount: number;
    }
  | { kind: "confirmed"; amount: number };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBankFallback?: () => void;
};

export function DonateModal({ open, onOpenChange, onBankFallback }: Props) {
  const [state, setState] = useState<ModalState>({ kind: "form" });
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: site.unitPrice,
      name: "",
      email: "",
      phone: "",
      message: "",
      anonymous: false,
    },
  });

  const amount = useWatch({ control: form.control, name: "amount" }) ?? 0;
  const phoneRequired = amount >= site.unitPrice;

  const onPaid = useCallback(() => {
    setState((prev) =>
      prev.kind === "pending" ? { kind: "confirmed", amount: prev.amount } : prev,
    );
  }, []);

  useDonationStatus(state.kind === "pending" ? state.donationId : null, onPaid);

  function onSubmit(values: DonationInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await createDonationInvoice(values);
      if (!result.ok) {
        setServerError(result.message);
        return;
      }
      setState({
        kind: "pending",
        donationId: result.donationId,
        qrImage: result.qrImage,
        amount: values.amount,
      });
    });
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      // Reset state when dialog closes.
      setTimeout(() => {
        setState({ kind: "form" });
        setServerError(null);
        form.reset();
      }, 200);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {state.kind === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-charcoal">
                {modal.title}
              </DialogTitle>
              <DialogDescription>{modal.subtitle}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 grid gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{modal.amountLabel}</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {modal.amountPresets.map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant={field.value === preset ? "default" : "outline"}
                            size="sm"
                            onClick={() => field.onChange(preset)}
                          >
                            {formatMNT(preset)}
                          </Button>
                        ))}
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          autoComplete="off"
                          min={1000}
                          step={1000}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          className="h-12 text-lg font-semibold"
                        />
                      </FormControl>
                      <p className="text-xs text-charcoal-muted">{modal.amountHint}</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{modal.nameLabel}</FormLabel>
                      <FormControl>
                        <Input autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{modal.emailLabel}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          spellCheck={false}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-charcoal-muted">{modal.emailHint}</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {modal.phoneLabel}{" "}
                        <span className="text-xs font-normal text-charcoal-muted">
                          {phoneRequired ? modal.phoneRequired : modal.phoneOptional}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{modal.messageLabel}</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          autoComplete="off"
                          placeholder={modal.messagePlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anonymous"
                  render={({ field }) => (
                    <FormItem>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="size-4 accent-clay"
                        />
                        {modal.anonymousLabel}
                      </label>
                    </FormItem>
                  )}
                />

                {serverError && (
                  <p className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {serverError}
                  </p>
                )}

                <Button type="submit" size="lg" disabled={pending} className="w-full">
                  {pending ? cta.generating : `${cta.generateQr} — ${formatMNT(amount)}`}
                </Button>

                {onBankFallback && (
                  <button
                    type="button"
                    onClick={onBankFallback}
                    className="mt-1 text-center text-sm text-clay underline-offset-4 hover:underline"
                  >
                    {modal.bankFallback}
                  </button>
                )}
              </form>
            </Form>
          </>
        )}

        {state.kind === "pending" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-charcoal">
                {modal.qrTitle}
              </DialogTitle>
              <DialogDescription>{modal.qrInstruction}</DialogDescription>
            </DialogHeader>

            <div className="mt-2 flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={`data:image/png;base64,${state.qrImage}`}
                  alt="QPay QR"
                  width={240}
                  height={240}
                  className="rounded-sm border border-border"
                  unoptimized
                />
                <span className="pointer-events-none absolute inset-0 animate-pulse rounded-sm ring-2 ring-clay/30" />
              </div>

              <p className="font-display text-2xl font-bold text-charcoal">
                {formatMNT(state.amount)}
              </p>

              <p className="inline-flex items-center gap-2 text-sm text-charcoal-muted">
                <Loader2 className="size-4 animate-spin" />
                {modal.waiting}
              </p>
            </div>
          </>
        )}

        {state.kind === "confirmed" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-charcoal">
                {modal.successTitle}
              </DialogTitle>
              <DialogDescription>{modal.successBody}</DialogDescription>
            </DialogHeader>

            <div className="mt-2 flex flex-col items-center gap-4 py-2">
              <CheckCircle2 className="size-14 text-clay" />
              <p className="font-display text-3xl font-bold text-charcoal">
                {formatMNT(state.amount)}
              </p>
              <p className="text-center text-sm leading-relaxed text-charcoal">
                {state.amount >= site.unitPrice ? modal.successCharm : modal.successMarquee}
              </p>
              <Button size="lg" onClick={() => handleOpenChange(false)} className="w-full">
                {cta.close}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
