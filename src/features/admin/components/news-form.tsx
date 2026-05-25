"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
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
import { createNews, updateNews } from "@/features/admin/actions";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { RichTextEditor } from "@/features/admin/components/rich-text-editor";
import { slugify } from "@/lib/utils";
import { newsSchema, type NewsInput } from "@/lib/validations";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";
const inputClass =
  "rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";

export function NewsForm({
  initial,
  mode,
  id,
}: {
  initial?: Partial<NewsInput>;
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      summary: initial?.summary ?? "",
      content: initial?.content ?? "",
      image_url: initial?.image_url ?? "",
      published_at:
        initial?.published_at ?? new Date().toISOString().slice(0, 10),
    },
  });

  // Auto-slug from title until user manually edits the slug field.
  const title = useWatch({ control: form.control, name: "title" });
  const slug = useWatch({ control: form.control, name: "slug" });
  const isSlugDirty = form.getFieldState("slug").isDirty;
  useEffect(() => {
    if (mode === "create" && !isSlugDirty) {
      const auto = slugify(title);
      if (auto !== slug) form.setValue("slug", auto, { shouldDirty: false });
    }
  }, [title, mode, isSlugDirty, slug, form]);

  function onSubmit(values: NewsInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createNews(values)
          : await updateNews(id!, values);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/news");
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
        className="grid gap-5 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Slug (URL)</FormLabel>
              <FormControl>
                <Input
                  className={`h-12 font-mono ${inputClass}`}
                  placeholder="news-url-slug"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                /news/<span className="font-mono">{field.value || "…"}</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Огноо</FormLabel>
              <FormControl>
                <Input type="date" className={`h-12 ${inputClass}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className={labelClass}>Нүүр зураг</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  folder="news"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Заавал биш. Хоосон бол placeholder харагдана. JPEG / PNG / WEBP, 5MB хүртэл.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className={labelClass}>Товч (summary)</FormLabel>
              <FormControl>
                <Textarea rows={3} className={inputClass} {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Жагсаалт + дэлгэрэнгүй хуудасны эхэнд харагдана.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className={labelClass}>Гол агуулга</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Toolbar ашиглан гарчиг, жагсаалт, холбоос, зураг оруулна уу.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
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
            size="default"
            onClick={() => router.push("/admin/news")}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
