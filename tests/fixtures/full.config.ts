import { ClientMode, defineConfig } from "santagift";

export default defineConfig(
  {},
  {
    ClientMode: ClientMode.Lockdown,
    EnableSilentMode: false,
    EnableSilentTTYMode: true,
    EventDetailText: "Details",
    UnknownBlockMessage: "This software is not allowed on this machine.",
    BrandingCompanyLogo: "file:///Library/Application%20Support/MyOrg/logo.png",
    StaticRules: [
      {
        RuleType: "TEAMID",
        Policy: "ALLOWLIST",
        Identifier: "EQHXZ8M8AV",
        Comment: "Allow Apple software",
      },
      {
        RuleType: "BINARY",
        Policy: "BLOCKLIST",
        Identifier: "abc123def456",
        CustomMsg: "Blocked binary",
      },
    ],
    FileAccessPolicy: {
      Version: "1.0",
      EventDetailURL: "https://example.com/fap",
      WatchItems: {
        SensitivePaths: {
          Paths: [{ Path: "/etc/passwd", IsPrefix: false }, { Path: "/etc/shadow" }],
          Options: {
            RuleType: "PathsWithDeniedProcesses",
            AuditOnly: true,
          },
          Processes: [{ SigningID: "com.apple.bash", PlatformBinary: true }],
        },
      },
    },
    FileAccessPolicyUpdateIntervalSec: 600,
    FileAccessGlobalWindowSizeSec: 15,
    AllowedPathRegex: "^/usr/local/",
    EnableTransitiveRules: true,
    EventLogType: "file",
    EventLogPath: "/var/db/santa/santa.log",
    FileChangesPrefixFilters: ["/private/tmp/"],
    BlockUSBMount: true,
    RemountUSBMode: ["rdonly", "noexec"],
    MetricFormat: "rawjson",
    MetricURL: "https://metrics.example.com",
    MetricExportInterval: 60,
    MetricExportTimeout: 30,
    MetricExtraLabels: { env: "prod", region: "us-east-1" },
  },
);
