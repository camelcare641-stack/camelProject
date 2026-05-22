import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// See note in client.ts: pass `<Database>` once you replace the hand-rolled
// schema with one generated via `supabase gen types typescript --linked`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll fails inside RSC; middleware refreshes the session anyway.
          }
        },
      },
    },
  );
}
