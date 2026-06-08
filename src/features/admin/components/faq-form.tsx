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
import { createFaq, updateFaq } from "@/features/admin/actions";
import { faqSchema, type FaqInput } from "@/lib/validations";
import { inputClass, labelClass } from "./form-styles";

export function FaqForm({
  initial,
  mode,
  id,
}: {
  initial?: Partial<FaqInput>;
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: initial?.question ?? "",
      answer: initial?.answer ?? "",
      sort_order: initial?.sort_order ?? 0,
    },
  });

  function onSubmit(values: FaqInput) {
    startTransition(async () => {
      const result =
        mode === "create" ? await createFaq(values) : await updateFaq(id!, values);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/faqs");
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
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Асуулт</FormLabel>
              <FormControl>
                <Input className={`h-12 ${inputClass}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Хариулт</FormLabel>
              <FormControl>
                <Textarea rows={5} className={inputClass} {...field} />
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
            onClick={() => router.push("/admin/faqs")}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
