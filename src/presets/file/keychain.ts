import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * keychain is audit-only — noisy if blocked outright.
 *
 * from: https://northpole.security/blog/2025-advent-calendar#day-9-watch-your-keychain
 */
export const keychain: Record<string, FileAccessPolicyEntry> = {
  WatchKeychainReads: {
    Paths: [{ Path: "/Users/*/Library/Keychains/*.keychain-db" }],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: true,
    },
    Processes: [
      { SigningID: "com.apple.securityd", PlatformBinary: true },
      { SigningID: "com.apple.mdworker_shared", PlatformBinary: true },
      { SigningID: "com.apple.backupd", PlatformBinary: true },
      { SigningID: "com.apple.MigrationAssistant", PlatformBinary: true },
      {
        SigningID: "com.apple.security.XPCKeychainSandboxCheck",
        PlatformBinary: true,
      },
      { SigningID: "com.apple.Safari", PlatformBinary: true },
    ],
  },
};
