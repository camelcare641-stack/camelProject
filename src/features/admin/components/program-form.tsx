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
import { createProgram, updateProgram } from "@/features/admin/actions";
import { programFormSchema, type ProgramFormInput } from "@/lib/validations";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";
const inputClass =
  "rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";

export function ProgramForm({
  initial,
  mode,
  id,
}: {
  initial?: { code: string; title: string; items: string[]; sort_order: number };
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<ProgramFormInput>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      code: initial?.code ?? "",
      title: initial?.title ?? "",
      // Edit as one bullet per line.
      items: (initial?.items ?? []).join("\n"),
      sort_order: initial?.sort_order ?? 0,
    },
  });

  function onSubmit(values: ProgramFormInput) {
    const items = values.items
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      code: values.code,
      title: values.title,
      items,
      sort_order: values.sort_order,
    };
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProgram(payload)
          : await updateProgram(id!, payload);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/programs");
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Код</FormLabel>
              <FormControl>
                <Input
                  placeholder="6.1"
                  className={`h-12 max-w-[140px] ${inputClass}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Гарчиг</FormLabel>
              <FormControl>
                <Input className={`h-12 ${inputClass}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Дэд зүйлс</FormLabel>
              <FormControl>
                <Textarea rows={6} className={inputClass} {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Мөр бүрт нэг зүйл бичнэ.
              </FormDescription>
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
            onClick={() => router.push("/admin/programs")}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
