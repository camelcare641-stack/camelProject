// Vitest stand-in for the `server-only` package, which throws if imported
// outside a React Server Component. Tests run server-only modules (the QPay
// client, email/thank-you helpers) directly in the node environment, so we
// alias `server-only` to this empty module via vitest.config.ts.
export {};
