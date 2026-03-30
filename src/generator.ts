import { randomUUID } from "node:crypto";
import type { FileAccessPolicyEntry, SantaGiftConfig } from "./index.js";
import {
  plistArray,
  plistBool,
  plistDict,
  plistDocument,
  plistInteger,
  plistString,
} from "./plist.js";

const CLIENT_MODE_MAP = { monitor: 1, lockdown: 2 } as const;

// level = the indentation level of the dict tag itself
function buildPolicyEntryDict(
  entry: FileAccessPolicyEntry,
  level: number,
): string {
  const pairs: [string, string][] = [];

  // Paths array at level+1, each path dict at level+2
  const pathDicts = entry.paths.map((p) => {
    const pathPairs: [string, string][] = [["Path", plistString(p.path)]];
    if (p.isPrefix !== undefined) {
      pathPairs.push(["IsPrefix", plistBool(p.isPrefix)]);
    }
    return plistDict(pathPairs, level + 2);
  });
  pairs.push(["Paths", plistArray(pathDicts, level + 1)]);

  // Options dict at level+1
  const optionPairs: [string, string][] = [];
  if (entry.options.allowReadAccess !== undefined) {
    optionPairs.push([
      "AllowReadAccess",
      plistBool(entry.options.allowReadAccess),
    ]);
  }
  if (entry.options.auditOnly !== undefined) {
    optionPairs.push(["AuditOnly", plistBool(entry.options.auditOnly)]);
  }
  if (entry.options.ruleType !== undefined) {
    optionPairs.push(["RuleType", plistString(entry.options.ruleType)]);
  }
  pairs.push(["Options", plistDict(optionPairs, level + 1)]);

  // Processes array at level+1 (optional)
  if (entry.processes && entry.processes.length > 0) {
    const procDicts = entry.processes.map((proc) => {
      const procPairs: [string, string][] = [];
      if (proc.signingId !== undefined) {
        procPairs.push(["SigningID", plistString(proc.signingId)]);
      }
      if (proc.teamId !== undefined) {
        procPairs.push(["TeamID", plistString(proc.teamId)]);
      }
      if (proc.platformBinary !== undefined) {
        procPairs.push(["PlatformBinary", plistBool(proc.platformBinary)]);
      }
      return plistDict(procPairs, level + 2);
    });
    pairs.push(["Processes", plistArray(procDicts, level + 1)]);
  }

  return plistDict(pairs, level);
}

export function generatePlist(config: SantaGiftConfig): string {
  const outerUuid = randomUUID();
  const santaUuid = randomUUID();
  const { santaConfig } = config;

  // Santa payload dict sits inside <array> inside root <dict>, so level=2
  const santaLevel = 2;
  const santaPairs: [string, string][] = [];

  if (santaConfig.clientMode !== undefined) {
    santaPairs.push([
      "ClientMode",
      plistInteger(CLIENT_MODE_MAP[santaConfig.clientMode]),
    ]);
  }
  if (santaConfig.failClosed !== undefined) {
    santaPairs.push(["FailClosed", plistBool(santaConfig.failClosed)]);
  }
  if (
    santaConfig.fileAccessPolicy &&
    Object.keys(santaConfig.fileAccessPolicy).length > 0
  ) {
    // FileAccessPolicy dict at santaLevel+1=3, each named entry dict at santaLevel+2=4
    const policyPairs: [string, string][] = Object.entries(
      santaConfig.fileAccessPolicy,
    ).map(([k, v]) => [k, buildPolicyEntryDict(v, santaLevel + 2)]);
    santaPairs.push([
      "FileAccessPolicy",
      plistDict(policyPairs, santaLevel + 1),
    ]);
  }

  santaPairs.push(["PayloadDisplayName", plistString("Santa")]);
  santaPairs.push(["PayloadType", plistString("com.northpolesec.santa")]);
  santaPairs.push(["PayloadVersion", plistInteger(1)]);
  santaPairs.push(["PayloadUUID", plistString(santaUuid)]);
  santaPairs.push([
    "PayloadIdentifier",
    plistString(`com.northpolesec.santa.${santaUuid}`),
  ]);

  const santaDict = plistDict(santaPairs, santaLevel);

  // Root envelope dict at level=0; PayloadContent array at level=1
  const outerPairs: [string, string][] = [
    ["PayloadContent", plistArray([santaDict], 1)],
    ["PayloadDisplayName", plistString("Santa")],
    ["PayloadEnabled", plistBool(true)],
    ["PayloadType", plistString("Configuration")],
    ["PayloadScope", plistString("System")],
    ["PayloadUUID", plistString(outerUuid)],
    ["PayloadIdentifier", plistString("com.northpolesec.santa")],
  ];

  return plistDocument(plistDict(outerPairs, 0));
}
