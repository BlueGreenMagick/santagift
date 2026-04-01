import type { FileAccessPolicyEntry } from "../../types.js";

/**
 * Prevent softwares using spotlight for persistence and read priveleged files.
 *
 * Spotlight produces two watch items: importer directories and sensitive databases.
 *
 * From: https://northpole.security/blog/2025-advent-calendar#day-18-stay-out-of-the-spotlight
 */
export const spotlight: Record<string, FileAccessPolicyEntry> = {
  SpotlightImporterProtection: {
    Paths: [
      { Path: "/Users/*/Library/Spotlight", IsPrefix: true },
      { Path: "/Library/Spotlight", IsPrefix: true },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: true,
      AuditOnly: false,
      EnableSilentMode: true,
    },
    Processes: [
      { SigningID: "com.apple.mds", PlatformBinary: true },
      { SigningID: "com.apple.mdworker", PlatformBinary: true },
      { SigningID: "com.apple.mdworker_shared", PlatformBinary: true },
      { SigningID: "com.apple.mdimport", PlatformBinary: true },
      { SigningID: "com.apple.installer", PlatformBinary: true },
    ],
  },
  ProtectAppleIntelligenceAndPhotosDatabases: {
    Paths: [
      {
        Path: "/Users/*/Library/Application Support/Knowledge",
        IsPrefix: true,
      },
      {
        Path: "/Users/*/Pictures/Photos Library.photoslibrary",
        IsPrefix: true,
      },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: true,
    },
    Processes: [
      { SigningID: "com.apple.Photos", PlatformBinary: true },
      { SigningID: "com.apple.MediaAnalysis", PlatformBinary: true },
      { SigningID: "com.apple.photolibraryd", PlatformBinary: true },
      { SigningID: "com.apple.assetsd", PlatformBinary: true },
      { SigningID: "com.apple.cloudphotod", PlatformBinary: true },
      { SigningID: "com.apple.intelligenceplatformd", PlatformBinary: true },
      { SigningID: "com.apple.knowledgeconstructiond", PlatformBinary: true },
    ],
  },
};
