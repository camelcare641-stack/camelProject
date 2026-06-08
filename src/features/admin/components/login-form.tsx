"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { signIn } from "@/features/admin/actions";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validations";
import { labelClass, inputClass as inputBase } from "./form-styles";

const inputClass = `h-11 ${inputBase}`;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [pending, startTransition] = useTransition();
  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: AdminLoginInput) {
    startTransition(async () => {
      const result = await signIn(values);
      if (result.ok) {
        toast.success(result.message);
        router.replace(next);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>И-мэйл</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Нууц үг</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  className={inputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
        </Button>
      </form>
    </Form>
  );
}
