import type { FileAccessPolicyEntry } from "../../types.js";

export const chromeCookies: Record<string, FileAccessPolicyEntry> = {
  ChromeCookies: {
    Paths: [
      {
        Path: "/Users/*/Library/Application Support/Google/Chrome/*/Cookies",
        IsPrefix: true,
      },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: false,
    },
    Processes: [
      { SigningID: "com.google.Chrome*", TeamID: "EQHXZ8M8AV" },
      { SigningID: "com.apple.mdworker_shared", PlatformBinary: true },
      { SigningID: "com.apple.mds", PlatformBinary: true },
    ],
  },
};
