import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * Prevent dynamic loading from memory. May break legitimate apps.
 *
 * from: https://northpole.security/blog/2025-advent-calendar#day-15-in-memoriam
 */
export const inMemoryLoading: Record<string, FileAccessPolicyEntry> = {
  BlockInMemoryLoading: {
    Paths: [
      {
        Path: "/private/var/folders/*/*/T/NSCreateObjectFileImageFromMemory-",
        IsPrefix: true,
      },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: false,
      BlockMessage: "In memory loading not allowed.",
    },
    Processes: [],
  },
};
