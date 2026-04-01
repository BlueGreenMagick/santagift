import { basename } from "node:path";
import type { FileAccessPolicyEntry } from "../../../types.js";

/**
 * Protect V8 heap snapshot files in electron
 *
 * from: https://northpole.security/blog/2025-advent-calendar#day-1-electron-apps-on-a-short-fuse
 */
export function electronV8Heap(
  appPath: string,
  teamId: string,
): Record<string, FileAccessPolicyEntry> {
  const appName = basename(appPath, ".app");
  return {
    [appName]: {
      Paths: [
        {
          Path: `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/v8*.bin`,
        },
      ],
      Options: {
        RuleType: "PathsWithAllowedProcesses",
        AllowReadAccess: false,
        AuditOnly: false,
      },
      Processes: [{ TeamID: teamId }],
    },
  };
}
