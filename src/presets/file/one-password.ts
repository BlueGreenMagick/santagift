import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * From: https://northpole.security/blog/2025-advent-calendar#day-17-protect-1password
 */
export const onePassword: Record<string, FileAccessPolicyEntry> = {
  OnePasswordDatabase: {
    Paths: [
      {
        Path: "/Users/*/Library/Group Containers/2BUA8C4S2C.com.agilebits",
        IsPrefix: true,
      },
      {
        Path: "/Users/*/Library/Group Containers/2BUA8C4S2C.com.1password",
        IsPrefix: true,
      },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: false,
      BlockMessage: "1Password is protected",
    },
    Processes: [
      { SigningID: "com.apple.containermanagerd", PlatformBinary: true },
      { SigningID: "com.apple.UserEventAgent", PlatformBinary: true },
      { SigningID: "com.apple.XProtectFramework.*", PlatformBinary: true },
      { TeamID: "2BUA8C4S2C" },
    ],
  },
};
