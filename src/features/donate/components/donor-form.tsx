"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { submitDonor } from "@/features/donate/actions";
import { site } from "@/lib/content";
import { donorSchema } from "@/lib/validations";

// Marquee form only collects the donor's name; amount is always one charm.
const donorFormSchema = donorSchema.pick({ name: true });
type DonorFormValues = { name: string };

export function DonorForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: { name: "" },
  });

  function onSubmit({ name }: DonorFormValues) {
    startTransition(async () => {
      const result = await submitDonor({ name, amount: site.unitPrice });
      if (result.ok) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Таны нэр</FormLabel>
              <FormControl>
                <Input
                  placeholder="Таны нэр (хандивлагчдын жагсаалтад харагдана)…"
                  autoComplete="name"
                  className="h-12 rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" disabled={pending} className="h-12">
          {pending ? "Илгээж байна…" : "Бүртгүүлэх"}
        </Button>
      </form>
    </Form>
  );
}
