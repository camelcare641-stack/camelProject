"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitMessage } from "@/features/contact/actions";
import { messageSchema, type MessageInput } from "@/lib/validations";

const fieldLabel =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";
const fieldInput =
  "h-12 rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { name: "", contact: "", topic: "", body: "" },
  });

  function onSubmit(values: MessageInput) {
    startTransition(async () => {
      const result = await submitMessage(values);
      if (result.ok) {
        toast.success(result.message);
        form.reset();
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
              <FormLabel className={fieldLabel}>
                Нэр <span className="text-clay">*</span>
              </FormLabel>
              <FormControl>
                <Input autoComplete="name" className={fieldInput} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>
                Утас эсвэл и-мэйл <span className="text-clay">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  className={fieldInput}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Сэдэв</FormLabel>
              <FormControl>
                <Input
                  className={fieldInput}
                  autoComplete="off"
                  placeholder="Жишээ нь: хамтран ажиллах саналтай…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>
                Зурвас <span className="text-clay">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  autoComplete="off"
                  className="min-h-32 rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="mt-1 sm:self-start"
        >
          {pending ? "Илгээж байна…" : "Илгээх"}
        </Button>
      </form>
    </Form>
  );
}
