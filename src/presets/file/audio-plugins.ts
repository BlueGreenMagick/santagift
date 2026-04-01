import type { FileAccessPolicyEntry } from "../../types.js";

// c.f. https://northpole.security/blog/2025-advent-calendar#day-22-drop-the-bass-not-the-payload
export const audioPlugins: Record<string, FileAccessPolicyEntry> = {
  BlockAllAudioPlugins: {
    Paths: [
      { Path: "/Library/Audio/Plug-Ins/", IsPrefix: true },
      { Path: "/Users/*/Library/Audio/Plug-Ins/", IsPrefix: true },
      { Path: "/Library/Audio/MIDI Drivers/", IsPrefix: true },
      { Path: "/Users/*/Library/Audio/MIDI Drivers/", IsPrefix: true },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: true,
      AuditOnly: false,
    },
    Processes: [],
  },
};
