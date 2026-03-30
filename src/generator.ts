import { randomUUID } from "node:crypto";
import type { FileAccessPolicyEntry, SantaGiftConfig } from "./index.js";
import { PlistWriter, plistDocument } from "./plist.js";

const CLIENT_MODE_MAP = { monitor: 1, lockdown: 2 } as const;

function writePolicyEntry(w: PlistWriter, entry: FileAccessPolicyEntry): void {
  w.keyArray("Paths", (arr) => {
    for (const p of entry.paths) {
      arr.dict((d) => {
        d.keyString("Path", p.path).optKeyBool("IsPrefix", p.isPrefix);
      });
    }
  });

  w.keyDict("Options", (opts) => {
    opts
      .optKeyBool("AllowReadAccess", entry.options.allowReadAccess)
      .optKeyBool("AuditOnly", entry.options.auditOnly)
      .optKeyString("RuleType", entry.options.ruleType);
  });

  if (entry.processes && entry.processes.length > 0) {
    w.keyArray("Processes", (arr) => {
      for (const proc of entry.processes!) {
        arr.dict((d) => {
          d.optKeyString("SigningID", proc.signingId)
            .optKeyString("TeamID", proc.teamId)
            .optKeyBool("PlatformBinary", proc.platformBinary);
        });
      }
    });
  }
}

export function generatePlist(config: SantaGiftConfig): string {
  const outerUuid = randomUUID();
  const santaUuid = randomUUID();
  const { santaConfig } = config;

  return plistDocument((root) => {
    root.keyArray("PayloadContent", (arr) => {
      arr.dict((santa) => {
        if (santaConfig.clientMode !== undefined) {
          santa.keyInteger("ClientMode", CLIENT_MODE_MAP[santaConfig.clientMode]);
        }
        santa.optKeyBool("FailClosed", santaConfig.failClosed);

        if (santaConfig.fileAccessPolicy && Object.keys(santaConfig.fileAccessPolicy).length > 0) {
          santa.keyDict("FileAccessPolicy", (policy) => {
            for (const [k, v] of Object.entries(santaConfig.fileAccessPolicy!)) {
              policy.keyDict(k, (entry) => writePolicyEntry(entry, v));
            }
          });
        }

        santa
          .keyString("PayloadDisplayName", "Santa")
          .keyString("PayloadType", "com.northpolesec.santa")
          .keyInteger("PayloadVersion", 1)
          .keyString("PayloadUUID", santaUuid)
          .keyString("PayloadIdentifier", `com.northpolesec.santa.${santaUuid}`);
      });
    });

    root
      .keyString("PayloadDisplayName", "Santa")
      .keyBool("PayloadEnabled", true)
      .keyString("PayloadType", "Configuration")
      .keyString("PayloadScope", "System")
      .keyString("PayloadUUID", outerUuid)
      .keyString("PayloadIdentifier", "com.northpolesec.santa");
  });
}
