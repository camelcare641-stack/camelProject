"use client";

import { useRouter } from "next/navigation";
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
import { createDonor } from "@/features/admin/actions";
import { donorAdminSchema, type DonorAdminInput } from "@/lib/validations";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";
const inputClass =
  "h-12 rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";

/** Inline "add donor" form for recording offline / bank-transfer donors. */
export function DonorForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<DonorAdminInput>({
    resolver: zodResolver(donorAdminSchema),
    defaultValues: { name: "", amount: 25000 },
  });

  function onSubmit(values: DonorAdminInput) {
    startTransition(async () => {
      const result = await createDonor(values);
      if (result.ok) {
        toast.success(result.message);
        form.reset({ name: "", amount: 25000 });
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="min-w-[200px] flex-1">
              <FormLabel className={labelClass}>Нэр</FormLabel>
              <FormControl>
                <Input className={inputClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormLabel className={labelClass}>Дүн (₮)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={1000}
                  className={inputClass}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Нэмж байна…" : "+ Нэмэх"}
        </Button>
      </form>
    </Form>
  );
}
