import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { afterEach, beforeAll, beforeEach, expect, it } from "vitest";
import { execSync } from "node:child_process";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const fixturesDir = fileURLToPath(new URL("./fixtures", import.meta.url));

let tempDir: string;

beforeAll(() => {
  execSync("pnpm build", { cwd: rootDir });
});

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "santagift-"));
});

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true });
});

it("writes santa.mobileconfig by default", () => {
  const fixture = resolve(fixturesDir, "minimal.config.ts");
  const result = spawnSync("node", [resolve(rootDir, "dist/cli.mjs"), "--config", fixture], {
    cwd: tempDir,
    env: { ...process.env, TEST_SANTAGIFT_UUID: "00000000-0000-0000-0000-000000000000" },
    encoding: "utf-8",
  });
  expect(result.status).toBe(0);
  const output = readFileSync(join(tempDir, "santa.mobileconfig"), "utf-8");
  const expected = readFileSync(resolve(fixturesDir, "minimal.expected.plist"), "utf-8");
  expect(output).toBe(expected);
});

it("writes to custom outFile", () => {
  const fixture = resolve(fixturesDir, "custom-out.config.ts");
  const result = spawnSync("node", [resolve(rootDir, "dist/cli.mjs"), "--config", fixture], {
    cwd: tempDir,
    env: { ...process.env, TEST_SANTAGIFT_UUID: "00000000-0000-0000-0000-000000000000" },
    encoding: "utf-8",
  });
  expect(result.status).toBe(0);
  const output = readFileSync(join(tempDir, "result.mobileconfig"), "utf-8");
  const expected = readFileSync(resolve(fixturesDir, "custom-out.expected.plist"), "utf-8");
  expect(output).toBe(expected);
});
