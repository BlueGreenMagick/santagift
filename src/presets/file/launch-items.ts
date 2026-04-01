import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * Log changes to Launch Items
 *
 * launchItems is audit-only — blocking would break normal installs/updates.
 *
 * from: https://northpole.security/blog/2025-advent-calendar#day-12-keep-track-of-launch-items
 */
export const launchItems: Record<string, FileAccessPolicyEntry> = {
  MonitorLaunchItems: {
    Paths: [
      { Path: "/Library/LaunchAgents/", IsPrefix: true },
      { Path: "/Library/LaunchDaemons/", IsPrefix: true },
      { Path: "/Users/*/Library/LaunchAgents/", IsPrefix: true },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: true,
      AuditOnly: true,
    },
    Processes: [],
  },
};
