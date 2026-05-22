import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Use inside admin server components / server actions / route handlers to
// harden against a middleware miss (e.g. routes that opt out of the matcher).
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
