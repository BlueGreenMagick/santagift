import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * Prevent writes to Pluggable Authentication Modules (PAM)
 *
 * from: https://northpole.security/blog/2025-advent-calendar#day-11-protect-against-pam-bypasses
 */
export const pamProtection: Record<string, FileAccessPolicyEntry> = {
  ProtectPAMSSHD: {
    Paths: [{ Path: "/private/etc/pam.d", IsPrefix: true }],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: true,
      AuditOnly: false,
      BlockMessage: "Leave PAM alone",
    },
    Processes: [],
  },
};
