import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { generatePlist } from "../src/generator.js";

process.env.TEST_SANTAGIFT_UUID = "00000000-0000-0000-0000-000000000000";

const fixturesDir = fileURLToPath(new URL("./fixtures", import.meta.url));

const fixtures = readdirSync(fixturesDir).filter((f) => f.endsWith(".config.ts"));

for (const filename of fixtures) {
  const name = filename.replace(".config.ts", "");
  it(name, async () => {
    const mod = await import(`./fixtures/${name}.config.ts`);
    const result = generatePlist(mod.default);
    const expectedPath = fileURLToPath(
      new URL(`./fixtures/${name}.expected.plist`, import.meta.url),
    );
    await expect(result).toMatchFileSnapshot(expectedPath);
  });
}
