"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AmountSelector } from "@/components/public/amount-selector";
import { donateForm, errors } from "@/lib/content";
import { donationSchema, type DonationInput } from "@/lib/validations";

export function DonationForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donor_name: "",
      donor_email: "",
      donor_phone: "",
      amount: donateForm.presetAmounts[2],
      message: "",
      is_anonymous: false,
      consent: false as unknown as true,
    },
  });

  async function onSubmit(values: DonationInput) {
    setSubmitting(true);
    try {
      // POST to the invoice route. The route creates a `pending` donation row
      // (via service-role admin client) and then asks QPay for an invoice.
      const res = await fetch("/api/qpay/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { invoiceId: string };
      router.push(`/donate/${data.invoiceId}`);
    } catch (e) {
      console.error(e);
      toast.error(errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="donor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{donateForm.nameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={donateForm.namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="donor_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{donateForm.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={donateForm.emailPlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="donor_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{donateForm.phoneLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={donateForm.phonePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{donateForm.amountLabel}</FormLabel>
              <FormControl>
                <AmountSelector
                  value={field.value ?? ""}
                  onChange={(v) =>
                    field.onChange(v === "" ? undefined : Number(v))
                  }
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
              <FormLabel>{donateForm.messageLabel}</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder={donateForm.messagePlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_anonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="leading-snug">
                {donateForm.anonymousLabel}
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="leading-snug">
                  {donateForm.consentLabel}{" "}
                  <Link href="#" className="underline">
                    {/* TODO: link to a real privacy policy page */}
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? donateForm.submitting : donateForm.submit}
        </Button>
      </form>
    </Form>
  );
}
