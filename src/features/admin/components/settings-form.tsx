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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "@/features/admin/actions";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { inputClass, labelClass } from "./form-styles";

type FieldKey = keyof SiteSettingsInput;

const groups: {
  title: string;
  fields: { name: FieldKey; label: string; multiline?: boolean; hint?: string }[];
}[] = [
  {
    title: "Байгууллага",
    fields: [
      { name: "org_name", label: "Байгууллагын нэр" },
      { name: "org_full_name", label: "Төслийн бүтэн нэр" },
      { name: "slogan", label: "Уриа" },
      { name: "hook", label: "Гол мессеж" },
      { name: "description", label: "Тайлбар", multiline: true },
    ],
  },
  {
    title: "Данс",
    fields: [
      { name: "bank_name", label: "Банк" },
      { name: "bank_holder", label: "Хүлээн авагч" },
      { name: "bank_account", label: "Дансны дугаар" },
      { name: "bank_note", label: "Анхааруулга", multiline: true },
    ],
  },
  {
    title: "Холбоо барих",
    fields: [
      { name: "contact_phone", label: "Утас" },
      { name: "contact_email", label: "И-мэйл" },
      { name: "contact_address", label: "Хаяг", multiline: true },
    ],
  },
];

export function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const defaults = Object.fromEntries(
    groups.flatMap((g) => g.fields).map((f) => [f.name, initial[f.name] ?? ""]),
  ) as SiteSettingsInput;

  const form = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: defaults,
  });

  function onSubmit(values: SiteSettingsInput) {
    startTransition(async () => {
      const result = await updateSiteSettings(values);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10">
        {groups.map((group) => (
          <fieldset key={group.title} className="grid gap-5">
            <legend className="font-display text-lg font-semibold text-charcoal">
              {group.title}
            </legend>
            {group.fields.map((f) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>{f.label}</FormLabel>
                    <FormControl>
                      {f.multiline ? (
                        <Textarea
                          rows={3}
                          className={inputClass}
                          {...field}
                          value={field.value ?? ""}
                        />
                      ) : (
                        <Input
                          className={`h-12 ${inputClass}`}
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    </FormControl>
                    {f.hint && (
                      <FormDescription className="text-xs">
                        {f.hint}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </fieldset>
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Хадгалж байна…" : "Хадгалах"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
