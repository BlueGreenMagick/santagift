import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * ssh produces two watch items: one blocking private key access, one allowing reads of public files/config.
 *
 * From: https://northpole.security/blog/2025-advent-calendar#day-19-better-than-a-fake-rock
 */
export const ssh: Record<string, FileAccessPolicyEntry> = {
  ProtectSSHKeys: {
    Paths: [{ Path: "/Users/*/.ssh/", IsPrefix: true }],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: false,
      BlockMessage:
        "Access to SSH private keys is restricted to authorized applications only.",
    },
    Processes: [
      { SigningID: "com.apple.ssh", PlatformBinary: true },
      { SigningID: "com.apple.ssh-agent", PlatformBinary: true },
      { SigningID: "com.apple.ssh-add", PlatformBinary: true },
      { SigningID: "com.apple.ssh-keygen", PlatformBinary: true },
      { SigningID: "com.apple.git", PlatformBinary: true },
      { SigningID: "com.apple.security", PlatformBinary: true },
      { SigningID: "com.apple.mdworker_shared", PlatformBinary: true },
      {
        SigningID: "com.apple.XProtectFramework.plugins.*",
        PlatformBinary: true,
      },
      { SigningID: "Secretive.*", TeamID: "Z72PRUAWF6" },
    ],
  },
  AllowSSHPublicKeysAndConfigs: {
    Paths: [
      { Path: "/Users/*/.ssh/*.pub" },
      { Path: "/Users/*/.ssh/known_hosts" },
      { Path: "/Users/*/.ssh/config" },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: true,
      AuditOnly: false,
      BlockMessage:
        "Temporarily turn santa config off if you need to modify SSH public keys or configs.",
    },
    Processes: [
      { SigningID: "com.apple.ssh", PlatformBinary: true },
      { SigningID: "com.apple.ssh-agent", PlatformBinary: true },
      { SigningID: "com.apple.sshd", PlatformBinary: true },
      { SigningID: "com.apple.ssh-add", PlatformBinary: true },
      { SigningID: "com.apple.ssh-keygen", PlatformBinary: true },
      { SigningID: "com.apple.mdworker_shared", PlatformBinary: true },
      {
        SigningID: "com.apple.XProtectFramework.plugins.*",
        PlatformBinary: true,
      },
    ],
  },
};
