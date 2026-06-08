"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { createAboutItem, updateAboutItem } from "@/features/admin/actions";
import { aboutItemSchema, type AboutItemInput } from "@/lib/validations";
import { inputClass, labelClass } from "./form-styles";

const KIND_LABELS: Record<AboutItemInput["kind"], string> = {
  goal: "Зорилт",
  target: "Зорилтот бүлэг",
  outcome: "Хүлээгдэж буй үр дүн",
  camel_point: "“Тэмээ” цэг",
};

export function AboutItemForm({
  initial,
  mode,
  id,
}: {
  initial?: Partial<AboutItemInput>;
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<AboutItemInput>({
    resolver: zodResolver(aboutItemSchema),
    defaultValues: {
      kind: initial?.kind ?? "goal",
      title: initial?.title ?? "",
      body: initial?.body ?? "",
      sort_order: initial?.sort_order ?? 0,
    },
  });

  const kind = useWatch({ control: form.control, name: "kind" });
  const showTitle = kind === "camel_point";

  function onSubmit(values: AboutItemInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createAboutItem(values)
          : await updateAboutItem(id!, values);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/about");
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
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Төрөл</FormLabel>
              <FormControl>
                <select
                  className={`h-12 w-full px-3 ${inputClass}`}
                  {...field}
                >
                  {(
                    Object.keys(KIND_LABELS) as AboutItemInput["kind"][]
                  ).map((k) => (
                    <option key={k} value={k}>
                      {KIND_LABELS[k]}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showTitle && (
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Гарчиг</FormLabel>
                <FormControl>
                  <Input
                    className={`h-12 ${inputClass}`}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Зөвхөн “Тэмээ” цэгт хэрэглэнэ.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Текст</FormLabel>
              <FormControl>
                <Textarea rows={3} className={inputClass} {...field} />
              </FormControl>
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
                Төрөл доторх дараалал. Жижиг тоо эхэнд харагдана.
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
            onClick={() => router.push("/admin/about")}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
