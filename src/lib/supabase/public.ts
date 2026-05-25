import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookies-less Supabase client safe to use in `generateStaticParams` /
 * build-time data fetches where `next/headers` cookies() is unavailable.
 * Uses the public anon key only — same row-level security as the browser
 * client.
 */
export function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
