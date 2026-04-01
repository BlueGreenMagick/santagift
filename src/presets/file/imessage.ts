import type { FileAccessPolicyEntry } from "../../types.js";

// c.f. https://northpole.security/blog/2025-advent-calendar#day-3-keep-your-imessages-to-yourself
export const iMessage: Record<string, FileAccessPolicyEntry> = {
  iMessageHardening: {
    Paths: [
      { Path: "/Users/*/Library/Messages/chat.db*" },
      { Path: "/Users/*/Library/Messages/Attachments/*" },
    ],
    Options: {
      RuleType: "PathsWithAllowedProcesses",
      AllowReadAccess: false,
      AuditOnly: false,
    },
    Processes: [
      { SigningID: "com.apple.MobileSMS", PlatformBinary: true },
      { SigningID: "com.apple.fseventsd", PlatformBinary: true },
      {
        SigningID: "com.apple.PhotosUIPrivate.PhotosPosterProvider",
        PlatformBinary: true,
      },
      { SigningID: "com.apple.duetexpertd", PlatformBinary: true },
      { SigningID: "com.apple.imagent", PlatformBinary: true },
      {
        SigningID: "com.apple.imtransferservices.IMTransferAgent",
        PlatformBinary: true,
      },
      {
        SigningID: "com.apple.imdpersistence.IMDPersistenceAgent",
        PlatformBinary: true,
      },
      { SigningID: "com.apple.filecoordinationd", PlatformBinary: true },
      {
        SigningID: "com.apple.StorageManagement.Service",
        PlatformBinary: true,
      },
      {
        SigningID: "com.apple.IMAutomaticHistoryDeletionAgent",
        PlatformBinary: true,
      },
    ],
  },
};
