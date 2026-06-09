import { publicClient } from "@/lib/supabase/public";

type FetchRowsOptions = {
  /** Column to order by. Omit to leave ordering to the database default. */
  orderBy?: string;
  /** Sort direction when `orderBy` is set. Defaults to ascending. */
  ascending?: boolean;
  /** Cap the number of rows returned. */
  limit?: number;
};

/**
 * Standard public read: select `columns` from `table` with optional ordering
 * and limit, logging and returning [] on error. Supabase column strings are
 * untyped, so callers supply the row type `T` (mirroring the per-feature type)
 * exactly as the hand-written queries did with their `as T[]` casts.
 *
 * Uses the cookieless `publicClient` so the public pages that call it stay
 * statically renderable / ISR-cached — reading a cookie (the server client)
 * opts the whole route into dynamic rendering, defeating their `revalidate`.
 */
export async function fetchRows<T>(
  table: string,
  columns: string,
  options: FetchRowsOptions = {},
): Promise<T[]> {
  const supabase = publicClient();
  let query = supabase.from(table).select(columns);
  if (options.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.ascending ?? true,
    });
  }
  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }
  const { data, error } = await query;
  if (error) {
    console.error(`fetchRows(${table})`, error);
    return [];
  }
  return (data ?? []) as T[];
}
