import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      santagift: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
});
