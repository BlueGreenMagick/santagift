import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createJiti } from "jiti";
import { generatePlist } from "./generator.js";
import type { SantaGiftConfig } from "./index.js";

async function main() {
  const args = process.argv.slice(2);
  let configPath = "santa.config.ts";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--config" && args[i + 1]) {
      configPath = args[++i];
    }
  }

  const resolvedConfig = resolve(process.cwd(), configPath);
  const jiti = createJiti(pathToFileURL(resolvedConfig).href);
  const mod = (await jiti.import(resolvedConfig)) as {
    default?: SantaGiftConfig;
  };

  const config = mod.default;
  if (!config) {
    console.error("Error: config file must have a default export");
    process.exit(1);
  }

  const plist = generatePlist(config);
  const outFile = resolve(
    process.cwd(),
    config.generationOptions.outFile ?? "santa.mobileconfig",
  );

  writeFileSync(outFile, plist, "utf-8");
  console.log(`Written to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
