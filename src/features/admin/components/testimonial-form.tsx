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
import { createTestimonial, updateTestimonial } from "@/features/admin/actions";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";
const inputClass =
  "rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";

export function TestimonialForm({
  initial,
  mode,
  id,
}: {
  initial?: Partial<TestimonialInput>;
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author: initial?.author ?? "",
      role: initial?.role ?? "",
      body: initial?.body ?? "",
      photo_url: initial?.photo_url ?? "",
      sort_order: initial?.sort_order ?? 0,
    },
  });

  function onSubmit(values: TestimonialInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createTestimonial(values)
          : await updateTestimonial(id!, values);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/testimonials");
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
          name="author"
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Хэн болох</FormLabel>
              <FormControl>
                <Input
                  placeholder="жишээ нь: Эцэг эх"
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
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Сэтгэгдэл</FormLabel>
              <FormControl>
                <Textarea rows={4} className={inputClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Зураг</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  folder="testimonials"
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
            onClick={() => router.push("/admin/testimonials")}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
