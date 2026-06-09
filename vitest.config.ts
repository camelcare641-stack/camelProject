import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest harness. `resolve.tsconfigPaths` makes the "@/..." alias from
// tsconfig.json resolve in tests exactly as it does in the app (native Vite
// support — no extra plugin needed). Tests live next to the code they cover as
// `*.test.ts`. The default `node` environment is enough for the current
// pure-logic tests (utils, validation schemas); add `environment: "jsdom"` +
// @vitejs/plugin-react here when component tests are introduced.
//
// `server-only` is aliased to an empty stub: it throws when imported outside an
// RSC, but tests exercise server-only modules (QPay client, email/thank-you
// helpers) directly in the node environment.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(
        new URL("./src/test/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
