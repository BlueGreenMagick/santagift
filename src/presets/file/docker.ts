import type { FileAccessPolicyEntry } from "../../types.js";

// c.f. https://northpole.security/blog/2025-advent-calendar#day-22-drop-the-bass-not-the-payload
export const dockerSettings: Record<string, FileAccessPolicyEntry> = {
  ProtectDockerSettings: {
    Paths: [
      {
        Path: "/Users/*/Library/Group Containers/group.com.docker/",
        IsPrefix: true,
      },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: true,
      AuditOnly: false,
      BlockMessage: "Do not attempt to modify Docker settings",
    },
    Processes: [{ TeamID: "9BNSXJN65R" }],
  },
};
