import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * Prevent access to encrypted hash of your password
 *
 * from: https://northpole.security/blog/2025-advent-calendar#day-8-hide-your-hashes
 */
export const passwordHashes: Record<string, FileAccessPolicyEntry> = {
  ProtectPasswordHashStore: {
    Paths: [
      { Path: "/private/var/db/dslocal/nodes/Default/users/", IsPrefix: true },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: false,
    },
    Processes: [
      { SigningID: "com.apple.opendirectoryd", PlatformBinary: true },
    ],
  },
};
