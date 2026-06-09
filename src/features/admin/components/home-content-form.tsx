"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  Gift,
  Home,
  MessageSquareQuote,
  Newspaper,
  RotateCcw,
  Sparkles,
  TriangleAlert,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

type Group = {
  id: string;
  title: string;
  icon: LucideIcon;
  // One-line description of what this section controls on the live page.
  blurb: string;
  fields: { name: FieldKey; label: string; kind?: FieldKind; hint?: string }[];
};

const groups: Group[] = [
  {
    id: "hero",
    title: "Нүүр (Hero)",
    icon: Home,
    blurb: "Хуудасны эхний дэлгэц — гол гарчиг ба зураг.",
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
    id: "problem",
    title: "Асуудал",
    icon: TriangleAlert,
    blurb: "Бид ямар асуудлыг шийдэж байгааг тайлбарлах хэсэг.",
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
    id: "solution",
    title: "Шийдэл",
    icon: Sparkles,
    blurb: "Шийдэл ба 25,000₮-ийн үнэ цэнийг харуулах хэсэг.",
    fields: [
      { name: "home_solution_eyebrow", label: "Дэд гарчиг" },
      { name: "home_solution_body", label: "Текст", kind: "textarea" },
      { name: "home_solution_price", label: "Үнэ" },
      { name: "home_solution_price_caption", label: "Үнийн тайлбар" },
      { name: "home_solution_image_url", label: "Зураг", kind: "image" },
    ],
  },
  {
    id: "camel",
    title: "Тэмээ",
    icon: Gift,
    blurb: "Бэлгэдлийн тэмээ бүтээгдэхүүний утга, зургууд.",
    fields: [
      { name: "home_camel_eyebrow", label: "Дэд гарчиг" },
      { name: "home_camel_title", label: "Гарчиг", kind: "textarea" },
      { name: "home_camel_note", label: "Тэмдэглэл", kind: "textarea" },
      { name: "home_camel_image_1_url", label: "Зураг 1", kind: "image" },
      { name: "home_camel_image_2_url", label: "Зураг 2", kind: "image" },
    ],
  },
  {
    id: "news",
    title: "Мэдээ",
    icon: Newspaper,
    blurb: "Мэдээний хэсгийн гарчгууд (картууд автоматаар орно).",
    fields: [
      { name: "home_news_eyebrow", label: "Дэд гарчиг" },
      { name: "home_news_title", label: "Гарчиг" },
    ],
  },
  {
    id: "testimonials",
    title: "Сэтгэгдэл",
    icon: MessageSquareQuote,
    blurb: "Сэтгэгдлийн хэсгийн гарчгууд.",
    fields: [
      { name: "home_testimonials_eyebrow", label: "Дэд гарчиг" },
      { name: "home_testimonials_title", label: "Гарчиг" },
    ],
  },
  {
    id: "donate",
    title: "Хандив (данс)",
    icon: Wallet,
    blurb: "Хандив өгөх заавар, QR код ба тайлбар.",
    fields: [
      { name: "home_donate_eyebrow", label: "Дэд гарчиг" },
      { name: "home_donate_title", label: "Гарчиг" },
      { name: "home_donate_intro", label: "Тайлбар", kind: "textarea" },
      { name: "home_qr_image_url", label: "QR зураг", kind: "image" },
      { name: "home_qr_caption", label: "QR тайлбар", kind: "textarea" },
    ],
  },
];

const allFields = groups.flatMap((g) => g.fields);

export function HomeContentForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const defaults = Object.fromEntries(
    allFields.map((f) => [f.name, initial[f.name] ?? ""]),
  ) as HomeContentInput;

  const form = useForm<HomeContentInput>({
    resolver: zodResolver(homeContentSchema),
    defaultValues: defaults,
  });

  const isDirty = form.formState.isDirty;

  // Which accordion panels are open. Controlled so the expand-all toggle can
  // drive every panel, and so a failed save can reveal the panel holding the
  // error.
  const [open, setOpen] = useState<string[]>([groups[0].id]);
  const allOpen = open.length === groups.length;

  function toggleAll() {
    setOpen(allOpen ? [] : groups.map((g) => g.id));
  }

  function onSubmit(values: HomeContentInput) {
    startTransition(async () => {
      const result = await updateHomeContent(values);
      if (result.ok) {
        toast.success(result.message);
        // Re-baseline the form so the dirty state clears and the next edit
        // is measured against what was actually saved.
        form.reset(values);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  // A field can fail validation inside a collapsed panel. Open every panel that
  // holds an error (and scroll to the first) so the message is never hidden.
  function onInvalid(errors: FieldErrors<HomeContentInput>) {
    const bad = groups.filter((g) => g.fields.some((f) => errors[f.name]));
    if (bad.length === 0) return;
    setOpen((prev) => [
      ...prev,
      ...bad.map((g) => g.id).filter((id) => !prev.includes(id)),
    ]);
    requestAnimationFrame(() => {
      document
        .getElementById(bad[0].id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="min-w-0 pb-28 lg:pb-24"
      >
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-charcoal-muted transition-colors hover:bg-surface hover:text-charcoal"
          >
            {allOpen ? (
              <ChevronsDownUp className="size-4" />
            ) : (
              <ChevronsUpDown className="size-4" />
            )}
            {allOpen ? "Бүгдийг хаах" : "Бүгдийг нээх"}
          </button>
        </div>

        <Accordion
          multiple
          keepMounted
          value={open}
          onValueChange={(value) => setOpen(value as string[])}
          className="border border-border bg-white"
        >
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <AccordionItem
                key={group.id}
                value={group.id}
                id={group.id}
                className="scroll-mt-24 border-border lg:scroll-mt-8"
              >
                <AccordionTrigger className="items-start gap-3 rounded-none px-5 py-4 hover:no-underline data-panel-open:bg-surface sm:px-6">
                  <span className="flex flex-1 items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-clay-tint text-clay">
                      <Icon className="size-[18px]" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold leading-tight text-charcoal">
                        {group.title}
                      </span>
                      <span className="mt-0.5 block text-xs font-normal text-charcoal-muted">
                        {group.blurb}
                      </span>
                    </span>
                  </span>
                  <EmptyDot
                    control={form.control}
                    names={group.fields.map((f) => f.name)}
                  />
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-6 sm:px-6">
                  <div className="grid gap-5 border-t border-border pt-6">
                    {group.fields.map((f) => (
                      <FormField
                        key={f.name}
                        control={form.control}
                        name={f.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              {f.label}
                            </FormLabel>
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <SaveBar
          pending={pending}
          isDirty={isDirty}
          onReset={() => form.reset()}
        />
      </form>
    </Form>
  );
}

// Gold dot shown when every field in a section is empty (the section renders
// blank on the live page). Watches only its own fields so typing in one
// section never re-renders the others.
function EmptyDot({
  control,
  names,
}: {
  control: Control<HomeContentInput>;
  names: FieldKey[];
}) {
  const values = useWatch({ control, name: names }) as (string | undefined)[];
  if (values.some((v) => v)) return null;
  return (
    <span
      aria-label="хоосон"
      title="Энэ хэсэг хоосон байна"
      className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
    />
  );
}

// Always-visible action bar pinned to the bottom of the viewport, so saving
// never requires scrolling past every field. Communicates unsaved-changes
// state and offers a discard escape hatch.
function SaveBar({
  pending,
  isDirty,
  onReset,
}: {
  pending: boolean;
  isDirty: boolean;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-[15rem] lg:px-10">
      <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
        <p
          aria-live="polite"
          className="mr-auto flex items-center gap-2 text-xs text-charcoal-muted sm:text-sm"
        >
          {isDirty ? (
            <>
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-gold"
              />
              Хадгалаагүй өөрчлөлт байна
            </>
          ) : (
            <>
              <Check aria-hidden className="size-4 shrink-0 text-clay" />
              Бүх өөрчлөлт хадгалагдсан
            </>
          )}
        </p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={!isDirty || pending}
        >
          <RotateCcw className="size-4" />
          <span className="hidden sm:inline">Цуцлах</span>
        </Button>
        <Button type="submit" size="lg" disabled={pending || !isDirty}>
          {pending ? "Хадгалж байна…" : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
}
