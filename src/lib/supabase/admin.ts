import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS and column grants.
 * Server-only. Used by the QPay webhook, admin server actions/queries
 * (behind requireAdmin / the panel auth guard), and createDonationInvoice's
 * post-insert writes (anon has no UPDATE policy on donations).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
