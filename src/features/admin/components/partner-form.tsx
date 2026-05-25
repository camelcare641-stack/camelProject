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
import { createPartner, updatePartner } from "@/features/admin/actions";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { partnerSchema, type PartnerInput } from "@/lib/validations";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";
const inputClass =
  "rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";

export function PartnerForm({
  initial,
  mode,
  id,
}: {
  initial?: Partial<PartnerInput>;
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: initial?.name ?? "",
      logo_url: initial?.logo_url ?? "",
      website_url: initial?.website_url ?? "",
      sort_order: initial?.sort_order ?? 0,
    },
  });

  function onSubmit(values: PartnerInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createPartner(values)
          : await updatePartner(id!, values);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/partners");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Нэр</FormLabel>
              <FormControl>
                <Input className={`h-12 ${inputClass}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Лого</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  folder="partners"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Заавал биш. JPEG / PNG / WEBP, 5MB хүртэл.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Вэб хаяг</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://…"
                  className={`h-12 ${inputClass}`}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">Заавал биш.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Эрэмбэ</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className={`h-12 max-w-[140px] ${inputClass}`}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Жижиг тоо эхэнд харагдана.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={pending}>
            {pending
              ? "Хадгалж байна…"
              : mode === "create"
                ? "Нэмэх"
                : "Шинэчлэх"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/partners")}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
