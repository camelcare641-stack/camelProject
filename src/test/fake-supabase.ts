// A minimal, faithful stand-in for the Supabase query builder used by the
// payment + admin code paths. It supports exactly the chains those modules use
// (.from().select().eq().single(), .update().eq().eq().select().maybeSingle(),
// .insert(), .delete().eq(), and awaiting the builder directly) and records
// every call so tests can assert table, operation, payload, and .eq() filters
// without a live database.

export type Resolved = { data?: unknown; error?: unknown };

/** One `.from(table)` chain, with whatever was done to it. */
export type RecordedCall = {
  table: string;
  op: "select" | "insert" | "update" | "delete";
  payload?: unknown;
  eq: Array<[string, unknown]>;
};

/** Per-table results: `read` for select chains, `write` for insert/update/delete. */
export type TableResults = { read?: Resolved; write?: Resolved };
export type FakeConfig = Record<string, TableResults>;

type FakeBuilder = {
  select: (...args: unknown[]) => FakeBuilder;
  insert: (payload?: unknown) => FakeBuilder;
  update: (payload?: unknown) => FakeBuilder;
  delete: () => FakeBuilder;
  eq: (column: string, value: unknown) => FakeBuilder;
  in: (...args: unknown[]) => FakeBuilder;
  order: (...args: unknown[]) => FakeBuilder;
  limit: (...args: unknown[]) => FakeBuilder;
  single: () => Promise<Resolved>;
  maybeSingle: () => Promise<Resolved>;
  then: (
    onFulfilled: (value: Resolved) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise<unknown>;
};

const NONE: Resolved = { data: null, error: null };

export function makeFakeClient(
  config: FakeConfig = {},
  opts: { user?: unknown } = {},
) {
  const calls: RecordedCall[] = [];

  function from(table: string): FakeBuilder {
    const results = config[table] ?? {};
    const call: RecordedCall = { table, op: "select", eq: [] };
    calls.push(call);
    // Default to the read result; a write op switches the resolved value.
    let resolved: Resolved = results.read ?? NONE;

    const builder: FakeBuilder = {
      select: () => builder,
      insert: (payload) => {
        call.op = "insert";
        call.payload = payload;
        resolved = results.write ?? NONE;
        return builder;
      },
      update: (payload) => {
        call.op = "update";
        call.payload = payload;
        resolved = results.write ?? NONE;
        return builder;
      },
      delete: () => {
        call.op = "delete";
        resolved = results.write ?? NONE;
        return builder;
      },
      eq: (column, value) => {
        call.eq.push([column, value]);
        return builder;
      },
      in: () => builder,
      order: () => builder,
      limit: () => builder,
      single: () => Promise.resolve(resolved),
      maybeSingle: () => Promise.resolve(resolved),
      then: (onFulfilled, onRejected) =>
        Promise.resolve(resolved).then(onFulfilled, onRejected),
    };
    return builder;
  }

  const client = {
    from,
    auth: {
      getUser: () =>
        Promise.resolve({ data: { user: opts.user ?? null }, error: null }),
    },
  };

  return { client, calls };
}

/** Find the recorded call for a table + operation (first match). */
export function findCall(
  calls: RecordedCall[],
  table: string,
  op: RecordedCall["op"],
): RecordedCall | undefined {
  return calls.find((c) => c.table === table && c.op === op);
}
