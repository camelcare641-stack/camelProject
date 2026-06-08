"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Check,
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
import { cn } from "@/lib/utils";
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

  return (
    <Form {...form}>
      <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:items-start lg:gap-8">
        <SectionNav control={form.control} />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-0 pb-28 lg:pb-24"
        >
          <div className="grid gap-6">
            {groups.map((group) => {
              const Icon = group.icon;
              return (
                <fieldset
                  key={group.id}
                  id={group.id}
                  className="scroll-mt-28 border border-border bg-white lg:scroll-mt-8"
                >
                  <legend className="sr-only">{group.title}</legend>
                  <div className="flex items-start gap-3 border-b border-border bg-surface px-5 py-4 sm:px-6">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-clay-tint text-clay">
                      <Icon className="size-[18px]" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-semibold leading-tight text-charcoal">
                        {group.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-charcoal-muted">
                        {group.blurb}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 px-5 py-6 sm:px-6">
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
                </fieldset>
              );
            })}
          </div>

          <SaveBar pending={pending} isDirty={isDirty} onReset={() => form.reset()} />
        </form>
      </div>
    </Form>
  );
}

// Sticky section index. Horizontal scroll strip on mobile, vertical rail on
// desktop. Highlights the section currently in view and marks sections whose
// fields are all empty (those render blank on the live page).
function SectionNav({ control }: { control: Control<HomeContentInput> }) {
  const values = useWatch({ control }) as Partial<HomeContentInput>;
  const [activeId, setActiveId] = useState(groups[0].id);

  useEffect(() => {
    const sections = groups
      .map((g) => document.getElementById(g.id))
      .filter((el): el is HTMLElement => el !== null);

    // Active = the last section whose heading has scrolled above an imaginary
    // line near the top of the viewport. Reading top position (rather than an
    // IntersectionObserver band) keeps the final, possibly-short section
    // highlighted once you reach the bottom of the page.
    function update() {
      const line = 140;
      let current = groups[0].id;
      for (const el of sections) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
      }
      setActiveId(current);
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveId(id);
  }

  return (
    <nav
      aria-label="Хэсгүүд"
      className="sticky top-0 z-10 -mx-4 mb-4 flex gap-1.5 overflow-x-auto border-b border-border bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-8 lg:mx-0 lg:mb-0 lg:flex-col lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <p className="hidden px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-muted lg:block">
        Хэсгүүд
      </p>
      {groups.map((group) => {
        const active = group.id === activeId;
        const empty = group.fields.every((f) => !values?.[f.name]);
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => goTo(group.id)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors lg:w-full",
              active
                ? "bg-clay-tint text-clay"
                : "text-charcoal-muted hover:bg-paper hover:text-charcoal lg:hover:bg-surface",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-r-full bg-clay lg:block"
              />
            )}
            <span className="truncate">{group.title}</span>
            {empty && (
              <span
                aria-label="хоосон"
                title="Энэ хэсэг хоосон байна"
                className="ml-auto size-1.5 shrink-0 rounded-full bg-gold"
              />
            )}
          </button>
        );
      })}
    </nav>
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
      <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 lg:pl-[13rem]">
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
