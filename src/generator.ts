import { randomUUID } from "node:crypto";
import type { SantaGiftConfig } from "./index.js";
import { type PlistWriter, plistDocument } from "./plist.js";
import { PlistData, PlistReal } from "./types.js";

type PlistPrimitive = string | number | boolean | Date | PlistData | PlistReal;
type PlistValue = PlistPrimitive | PlistObject | PlistValue[];
interface PlistObject {
  [key: string]: PlistValue | undefined;
}

function isPlainObject(value: unknown): value is PlistObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof PlistData) &&
    !(value instanceof PlistReal)
  );
}

function hasSerializableContent(value: PlistValue | undefined): value is PlistValue {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.some((entry) => hasSerializableContent(entry));
  if (isPlainObject(value)) {
    return Object.values(value).some((entry) => hasSerializableContent(entry));
  }
  return true;
}

function writeValue(writer: PlistWriter, value: PlistValue): void {
  if (Array.isArray(value)) {
    writer.array((arr) => {
      for (const entry of value) {
        if (!hasSerializableContent(entry)) continue;
        writeValue(arr, entry);
      }
    });
    return;
  }

  if (isPlainObject(value)) {
    writer.dict((dict) => {
      for (const [entryKey, entryValue] of Object.entries(value)) {
        if (!hasSerializableContent(entryValue)) continue;
        dict.key(entryKey);
        writeValue(dict, entryValue);
      }
    });
    return;
  }

  if (value instanceof PlistData) {
    writer.data(value.toBase64());
    return;
  }

  if (value instanceof PlistReal) {
    writer.real(value.toNumber());
    return;
  }

  if (value instanceof Date) {
    writer.date(value);
    return;
  }

  if (typeof value === "string") {
    writer.string(value);
    return;
  }

  if (typeof value === "number") {
    writer.integer(value);
    return;
  }

  writer.bool(value);
}

function writeConfig(writer: PlistWriter, config: PlistObject): void {
  for (const [key, value] of Object.entries(config)) {
    if (!hasSerializableContent(value)) continue;
    writer.key(key);
    writeValue(writer, value);
  }
}

export function generatePlist(config: SantaGiftConfig): string {
  const outerUuid = process.env.TEST_SANTAGIFT_UUID ?? randomUUID();
  const santaUuid = process.env.TEST_SANTAGIFT_UUID ?? randomUUID();
  const { santaConfig } = config;

  return plistDocument((root) => {
    root.keyArray("PayloadContent", (arr) => {
      arr.dict((santa) => {
        writeConfig(santa, santaConfig as PlistObject);

        santa
          .keyString("PayloadDisplayName", "Santa")
          .keyString("PayloadType", "com.northpolesec.santa")
          .keyInteger("PayloadVersion", 1)
          .keyString("PayloadUUID", santaUuid)
          .keyString("PayloadIdentifier", `com.northpolesec.santa.${santaUuid}`);
      });
    });

    root
      .keyString("PayloadDisplayName", "Santa Configuration")
      .keyBool("PayloadEnabled", true)
      .keyString("PayloadType", "Configuration")
      .keyString("PayloadScope", "System")
      .keyString("PayloadUUID", outerUuid)
      .keyString("PayloadIdentifier", "com.northpolesec.santa");
  });
}
