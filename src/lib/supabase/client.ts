import { createBrowserClient } from "@supabase/ssr";

// NOTE: pass `<Database>` here once you replace `src/types/database.ts` with
// a file generated via `supabase gen types typescript --linked`. The
// hand-rolled type in this scaffold is a stand-in and is too loose for the
// strict generic constraints in @supabase/supabase-js v2.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
