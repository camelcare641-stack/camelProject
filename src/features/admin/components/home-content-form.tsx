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
import { ImageUpload } from "@/features/admin/components/image-upload";
import { updateHomeContent } from "@/features/admin/actions";
import { homeContentSchema, type HomeContentInput } from "@/lib/validations";
import { inputClass, labelClass } from "./form-styles";

type FieldKey = keyof HomeContentInput;
type FieldKind = "text" | "textarea" | "image";

const groups: {
  title: string;
  fields: { name: FieldKey; label: string; kind?: FieldKind; hint?: string }[];
}[] = [
  {
    title: "Нүүр (Hero)",
    fields: [
      {
        name: "home_hero_title",
        label: "Гарчиг",
        kind: "textarea",
        hint: "Мөр таслахын тулд Enter дарна.",
      },
      { name: "home_hero_subtitle", label: "Тайлбар", kind: "textarea" },
      { name: "home_hero_image_url", label: "Зураг", kind: "image" },
    ],
  },
  {
    title: "Асуудал",
    fields: [
      { name: "home_problem_eyebrow", label: "Дэд гарчиг" },
      { name: "home_problem_title", label: "Гарчиг", kind: "textarea" },
      {
        name: "home_problem_body",
        label: "Текст",
        kind: "textarea",
        hint: "Догол мөр бүрийг шинэ мөрөнд бичнэ.",
      },
      { name: "home_problem_image_url", label: "Зураг", kind: "image" },
    ],
  },
  {
    title: "Шийдэл",
    fields: [
      { name: "home_solution_eyebrow", label: "Дэд гарчиг" },
      { name: "home_solution_body", label: "Текст", kind: "textarea" },
      { name: "home_solution_price", label: "Үнэ" },
      { name: "home_solution_price_caption", label: "Үнийн тайлбар" },
      { name: "home_solution_image_url", label: "Зураг", kind: "image" },
    ],
  },
  {
    title: "Тэмээ",
    fields: [
      { name: "home_camel_eyebrow", label: "Дэд гарчиг" },
      { name: "home_camel_title", label: "Гарчиг", kind: "textarea" },
      { name: "home_camel_note", label: "Тэмдэглэл", kind: "textarea" },
      { name: "home_camel_image_1_url", label: "Зураг 1", kind: "image" },
      { name: "home_camel_image_2_url", label: "Зураг 2", kind: "image" },
    ],
  },
  {
    title: "Мэдээ",
    fields: [
      { name: "home_news_eyebrow", label: "Дэд гарчиг" },
      { name: "home_news_title", label: "Гарчиг" },
    ],
  },
  {
    title: "Сэтгэгдэл",
    fields: [
      { name: "home_testimonials_eyebrow", label: "Дэд гарчиг" },
      { name: "home_testimonials_title", label: "Гарчиг" },
    ],
  },
  {
    title: "Хандив (данс)",
    fields: [
      { name: "home_donate_eyebrow", label: "Дэд гарчиг" },
      { name: "home_donate_title", label: "Гарчиг" },
      { name: "home_donate_intro", label: "Тайлбар", kind: "textarea" },
      { name: "home_qr_image_url", label: "QR зураг", kind: "image" },
      { name: "home_qr_caption", label: "QR тайлбар", kind: "textarea" },
    ],
  },
];

export function HomeContentForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const defaults = Object.fromEntries(
    groups.flatMap((g) => g.fields).map((f) => [f.name, initial[f.name] ?? ""]),
  ) as HomeContentInput;

  const form = useForm<HomeContentInput>({
    resolver: zodResolver(homeContentSchema),
    defaultValues: defaults,
  });

  function onSubmit(values: HomeContentInput) {
    startTransition(async () => {
      const result = await updateHomeContent(values);
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
                      {f.kind === "image" ? (
                        <ImageUpload
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          folder="home"
                        />
                      ) : f.kind === "textarea" ? (
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
