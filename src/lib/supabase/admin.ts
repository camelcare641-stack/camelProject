import "server-only";

import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS. SERVER-SIDE ONLY — never import in client code.
// Used exclusively by the QPay webhook to insert/update paid donations.
// See note in client.ts about typing the client with a generated `Database`.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
