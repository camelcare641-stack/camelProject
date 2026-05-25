"use server";

import { createClient } from "@/lib/supabase/server";
import { messageSchema, type MessageInput } from "@/lib/validations";
import type { ActionResult } from "@/lib/types";

export async function submitMessage(input: MessageInput): Promise<ActionResult> {
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Алдаа гарлаа.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    contact: parsed.data.contact,
    topic: parsed.data.topic || null,
    body: parsed.data.body,
  });
  if (error) {
    console.error("submitMessage", error);
    return { ok: false, message: "Илгээхэд алдаа гарлаа." };
  }

  return {
    ok: true,
    message: "Зурвас илгээгдлээ. Бид тантай эргэн холбогдоно.",
  };
}
