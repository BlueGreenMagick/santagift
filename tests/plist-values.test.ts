import { expect, it } from "vitest";
import { generatePlist } from "../src/generator.js";
import type { SantaGiftConfig } from "../src/index.js";
import { ClientMode, PlistReal } from "../src/index.js";
import { PlistWriter } from "../src/plist.js";

process.env.TEST_SANTAGIFT_UUID = "00000000-0000-0000-0000-000000000000";

it("serializes Date values as plist dates", () => {
  const config = {
    generationOptions: {},
    santaConfig: {
      ClientMode: ClientMode.Monitor,
      TestDate: new Date("2026-03-31T12:34:56.000Z"),
    },
  } as unknown as SantaGiftConfig;

  const result = generatePlist(config);

  expect(result).toContain("<key>TestDate</key>");
  expect(result).toContain("<date>2026-03-31T12:34:56Z</date>");
});

it("serializes PlistReal values as plist reals", () => {
  const config = {
    generationOptions: {},
    santaConfig: {
      ClientMode: ClientMode.Monitor,
      TestReal: PlistReal.fromNumber(3.14),
    },
  } as unknown as SantaGiftConfig;

  const result = generatePlist(config);

  expect(result).toContain("<key>TestReal</key>");
  expect(result).toContain("<real>3.14</real>");
});

it("serializes special plist real values", () => {
  const writer = new PlistWriter();

  writer.real(Number.POSITIVE_INFINITY);
  writer.real(Number.NEGATIVE_INFINITY);
  writer.real(Number.NaN);

  expect(writer.toString()).toContain("<real>inf</real>");
  expect(writer.toString()).toContain("<real>-inf</real>");
  expect(writer.toString()).toContain("<real>nan</real>");
});

it("rejects non-integer plist integers with guidance", () => {
  const writer = new PlistWriter();

  expect(() => writer.integer(3.6)).toThrowError();
});

it("rejects non-finite plist integers", () => {
  const writer = new PlistWriter();

  expect(() => writer.integer(Number.NaN)).toThrowError();
  expect(() => writer.integer(Number.POSITIVE_INFINITY)).toThrowError();
});
