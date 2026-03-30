import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    outDir: "dist",
    dts: true,
    clean: true,
  },
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
  },
]);
