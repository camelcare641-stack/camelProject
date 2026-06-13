"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
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
import { createDonationInvoice, checkDonationPayment } from "@/features/donate/actions";
import { useDonationStatus } from "@/features/donate/hooks/use-donation-status";
import { donationSchema, type DonationInput } from "@/lib/validations";
import { cta, modal, site } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

type BankApp = { name: string; description: string; logo: string; link: string };

type ModalState =
  | { kind: "form" }
  | {
      kind: "pending";
      donationId: string;
      qrImage: string;
      bankApps: BankApp[];
      amount: number;
    }
  | { kind: "confirmed"; amount: number };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBankFallback?: () => void;
  /** Pre-fills the amount field (e.g. from the "хэдэн тэмээ" calculator). */
  initialAmount?: number;
};

export function DonateModal({
  open,
  onOpenChange,
  onBankFallback,
  initialAmount,
}: Props) {
  const [state, setState] = useState<ModalState>({ kind: "form" });
  const [pending, startTransition] = useTransition();
  const [checking, startChecking] = useTransition();
  const [checkNotice, setCheckNotice] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: initialAmount ?? site.unitPrice,
      name: "",
      email: "",
      phone: "",
      message: "",
      anonymous: false,
    },
  });

  // Sync the amount to the latest `initialAmount` each time the modal opens, so
  // the calculator's current total carries into a freshly-opened modal.
  useEffect(() => {
    if (open) {
      form.setValue("amount", initialAmount ?? site.unitPrice);
    }
  }, [open, initialAmount, form]);

  const amount = useWatch({ control: form.control, name: "amount" }) ?? 0;
  const phoneRequired = amount >= site.unitPrice;

  const onPaid = useCallback(() => {
    setState((prev) =>
      prev.kind === "pending" ? { kind: "confirmed", amount: prev.amount } : prev,
    );
  }, []);

  useDonationStatus(state.kind === "pending" ? state.donationId : null, onPaid);

  function onCheckNow() {
    if (state.kind !== "pending") return;
    const donationId = state.donationId;
    setCheckNotice(null);
    startChecking(async () => {
      const result = await checkDonationPayment(donationId);
      if (!result.ok) {
        setCheckNotice(result.message);
        return;
      }
      if (result.status === "paid") {
        onPaid();
        return;
      }
      setCheckNotice(modal.stillPending);
    });
  }

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
        bankApps: result.bankApps,
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
        setCheckNotice(null);
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
                          min={1}
                          step={1}
                          {...field}
                          // Render "" (not "0") when empty so there is no stray
                          // leading zero to type behind, e.g. "0" + "1" → "01".
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const next = e.target.value.replace(/^0+(?=\d)/, "");
                            field.onChange(next === "" ? 0 : Number(next));
                          }}
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

                <Button type="submit" variant="cta" size="lg" disabled={pending} className="w-full">
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
              {/* <DialogDescription>{modal.qrInstruction}</DialogDescription> */}
            </DialogHeader>

            <div className="mt-2 flex flex-col items-center gap-4">
              <p className="font-display text-2xl font-bold text-charcoal">
                {formatMNT(state.amount)}
              </p>

              {/* Bank-app deep links — the primary path on a phone: tapping a
                  bank hands off to its app with the payment pre-filled. The
                  schemes are no-ops on desktop, where the QR below is used. */}
              {state.bankApps.length > 0 && (
                <div className="w-full">
                  <p className="text-center text-sm font-semibold text-charcoal">
                    {modal.bankAppTitle}
                  </p>
                  {/* <p className="mt-1 text-center text-xs text-charcoal-muted">
                    {modal.bankAppHint}
                  </p> */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {state.bankApps.map((bank) => (
                      <a
                        key={bank.name}
                        href={bank.link}
                        className="flex flex-col items-center gap-1.5 rounded-md border border-border bg-white p-2 text-center no-underline transition-colors hover:border-clay hover:bg-paper hover:no-underline"
                        title={bank.description}
                      >
                        {/* QPay logo CDN — plain img avoids next/image remote
                            host config for a handful of tiny icons. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bank.logo}
                          alt=""
                          width={32}
                          height={32}
                          className="size-8 rounded-sm object-contain"
                          loading="lazy"
                        />
                        <span className="line-clamp-2 text-[11px] leading-tight text-charcoal">
                          {bank.description}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider into the QR fallback. */}
              {state.bankApps.length > 0 && (
                <div className="flex w-full items-center gap-3 text-xs text-charcoal-muted">
                  <span className="h-px flex-1 bg-border" />
                  {modal.orScanQr}
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}

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

              <p className="inline-flex items-center gap-2 text-sm text-charcoal-muted">
                <Loader2 className="size-4 animate-spin" />
                {modal.waiting}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCheckNow}
                disabled={checking}
              >
                {checking ? modal.checking : modal.checkNow}
              </Button>

              {checkNotice && (
                <p className="text-center text-xs text-charcoal-muted">{checkNotice}</p>
              )}
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
