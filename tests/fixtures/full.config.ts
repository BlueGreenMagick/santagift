import { defineConfig } from "santagift";

export default defineConfig(
  {},
  {
    clientMode: "lockdown",
    enableSilentMode: false,
    unknownBlockMessage: "This software is not allowed on this machine.",
    staticRules: [
      {
        ruleType: "TEAMID",
        policy: "ALLOWLIST",
        identifier: "EQHXZ8M8AV",
        comment: "Allow Apple software",
      },
      {
        ruleType: "BINARY",
        policy: "BLOCKLIST",
        identifier: "abc123def456",
        customMsg: "Blocked binary",
      },
    ],
    fileAccessPolicy: {
      version: "1.0",
      eventDetailURL: "https://example.com/fap",
      watchItems: {
        SensitivePaths: {
          paths: [{ path: "/etc/passwd", isPrefix: false }, { path: "/etc/shadow" }],
          options: {
            ruleType: "PathsWithDeniedProcesses",
            auditOnly: true,
          },
          processes: [
            { signingId: "com.apple.bash", platformBinary: true },
          ],
        },
      },
    },
    allowedPathRegex: "^/usr/local/",
    eventLogType: "file",
    eventLogPath: "/var/db/santa/santa.log",
    blockUSBMount: true,
    remountUSBMode: ["rdonly", "noexec"],
    metricFormat: "rawjson",
    metricURL: "https://metrics.example.com",
    metricExportInterval: 60,
    metricExtraLabels: { env: "prod", region: "us-east-1" },
  },
);
