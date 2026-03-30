import { randomUUID } from "node:crypto";
import type { FileAccessPolicyEntry, SantaGiftConfig } from "./index.js";
import { PlistWriter, plistDocument } from "./plist.js";

const CLIENT_MODE_MAP = { monitor: 1, lockdown: 2, standalone: 3 } as const;

function writePolicyEntry(w: PlistWriter, entry: FileAccessPolicyEntry): void {
  w.keyArray("Paths", (arr) => {
    for (const p of entry.paths) {
      arr.dict((d) => {
        d.keyString("Path", p.path).optKeyBool("IsPrefix", p.isPrefix);
      });
    }
  });

  w.keyDict("Options", (opts) => {
    opts
      .optKeyString("RuleType", entry.options.ruleType)
      .optKeyBool("AllowReadAccess", entry.options.allowReadAccess)
      .optKeyBool("AuditOnly", entry.options.auditOnly)
      .optKeyString("EventDetailURL", entry.options.eventDetailURL)
      .optKeyString("EventDetailText", entry.options.eventDetailText)
      .optKeyString("BlockMessage", entry.options.blockMessage)
      .optKeyBool("EnableSilentMode", entry.options.enableSilentMode)
      .optKeyBool("EnableSilentTTYMode", entry.options.enableSilentTTYMode);
  });

  if (entry.processes && entry.processes.length > 0) {
    w.keyArray("Processes", (arr) => {
      for (const proc of entry.processes!) {
        arr.dict((d) => {
          d.optKeyString("SigningID", proc.signingId)
            .optKeyString("TeamID", proc.teamId)
            .optKeyBool("PlatformBinary", proc.platformBinary)
            .optKeyString("CDHash", proc.cdHash)
            .optKeyString("CertificateSha256", proc.certificateSha256)
            .optKeyString("BinaryPath", proc.binaryPath);
        });
      }
    });
  }
}

export function generatePlist(config: SantaGiftConfig): string {
  const outerUuid = randomUUID();
  const santaUuid = randomUUID();
  const { santaConfig } = config;

  return plistDocument((root) => {
    root.keyArray("PayloadContent", (arr) => {
      arr.dict((santa) => {
        // General
        if (santaConfig.clientMode !== undefined) {
          santa.keyInteger("ClientMode", CLIENT_MODE_MAP[santaConfig.clientMode]);
        }
        santa
          .optKeyBool("FailClosed", santaConfig.failClosed)
          .optKeyBool(
            "EnableStandalonePasswordFallback",
            santaConfig.enableStandalonePasswordFallback,
          )
          .optKeyBool(
            "IgnoreOtherEndpointSecurityClients",
            santaConfig.ignoreOtherEndpointSecurityClients,
          )
          .optKeyBool("EnableStatsCollection", santaConfig.enableStatsCollection)
          .optKeyString("StatsOrganizationID", santaConfig.statsOrganizationID);

        // Sync
        santa
          .optKeyString("SyncBaseURL", santaConfig.syncBaseURL)
          .optKeyBool("SyncEnableProtoTransfer", santaConfig.syncEnableProtoTransfer);

        if (santaConfig.syncProxyConfiguration) {
          const proxy = santaConfig.syncProxyConfiguration;
          santa.keyDict("SyncProxyConfiguration", (d) => {
            d.optKeyBool("HTTPEnable", proxy.HTTPEnable)
              .optKeyString("HTTPProxy", proxy.HTTPProxy)
              .optKeyInteger("HTTPPort", proxy.HTTPPort)
              .optKeyBool("HTTPSEnable", proxy.HTTPSEnable)
              .optKeyString("HTTPSProxy", proxy.HTTPSProxy)
              .optKeyInteger("HTTPSPort", proxy.HTTPSPort)
              .optKeyBool("ProxyAutoConfigEnable", proxy.ProxyAutoConfigEnable)
              .optKeyString("ProxyAutoConfigURLString", proxy.ProxyAutoConfigURLString);
          });
        }

        santa
          .optKeyString("ClientAuthCertificateFile", santaConfig.clientAuthCertificateFile)
          .optKeyString("ClientAuthCertificatePassword", santaConfig.clientAuthCertificatePassword)
          .optKeyString("ServerAuthRootsFile", santaConfig.serverAuthRootsFile)
          .optKeyData("ServerAuthRootsData", santaConfig.serverAuthRootsData)
          .optKeyString("MachineID", santaConfig.machineID)
          .optKeyString("MachineOwner", santaConfig.machineOwner);

        if (santaConfig.machineOwnerGroups && santaConfig.machineOwnerGroups.length > 0) {
          santa.keyArray("MachineOwnerGroups", (arr) => {
            for (const g of santaConfig.machineOwnerGroups!) arr.string(g);
          });
        }

        santa.optKeyBool("EnableAllEventUpload", santaConfig.enableAllEventUpload);

        // GUI
        santa
          .optKeyBool("EnableSilentMode", santaConfig.enableSilentMode)
          .optKeyBool("EnableMenuItem", santaConfig.enableMenuItem)
          .optKeyString("AboutText", santaConfig.aboutText)
          .optKeyString("MoreInfoURL", santaConfig.moreInfoURL)
          .optKeyString("EventDetailURL", santaConfig.eventDetailURL)
          .optKeyString("UnknownBlockMessage", santaConfig.unknownBlockMessage)
          .optKeyString("BrandingCompanyName", santaConfig.brandingCompanyName)
          .optKeyString("BrandingLogo", santaConfig.brandingLogo);

        // File-Access Authorization
        if (santaConfig.fileAccessPolicy) {
          const fap = santaConfig.fileAccessPolicy;
          santa.keyDict("FileAccessPolicy", (policy) => {
            policy
              .keyString("Version", fap.version)
              .optKeyString("EventDetailURL", fap.eventDetailURL)
              .optKeyString("EventDetailText", fap.eventDetailText);

            if (fap.watchItems && Object.keys(fap.watchItems).length > 0) {
              policy.keyDict("WatchItems", (watchItems) => {
                for (const [k, v] of Object.entries(fap.watchItems!)) {
                  watchItems.keyDict(k, (entry) => writePolicyEntry(entry, v));
                }
              });
            }
          });
        }

        santa
          .optKeyString("FileAccessPolicyPlist", santaConfig.fileAccessPolicyPlist)
          .optKeyString("OverrideFileAccessAction", santaConfig.overrideFileAccessAction)
          .optKeyInteger("FileAccessGlobalLogsPerSec", santaConfig.fileAccessGlobalLogsPerSec);

        // Rules
        santa
          .optKeyString("AllowedPathRegex", santaConfig.allowedPathRegex)
          .optKeyString("BlockedPathRegex", santaConfig.blockedPathRegex)
          .optKeyBool("EnableBadSignatureProtection", santaConfig.enableBadSignatureProtection)
          .optKeyBool("EnablePageZeroProtection", santaConfig.enablePageZeroProtection);

        if (santaConfig.staticRules && santaConfig.staticRules.length > 0) {
          santa.keyArray("StaticRules", (arr) => {
            for (const rule of santaConfig.staticRules!) {
              arr.dict((d) => {
                d.keyString("RuleType", rule.ruleType)
                  .keyString("Policy", rule.policy)
                  .keyString("Identifier", rule.identifier)
                  .optKeyString("CustomMsg", rule.customMsg)
                  .optKeyString("CustomURL", rule.customURL)
                  .optKeyString("Comment", rule.comment);
              });
            }
          });
        }

        // Telemetry & Logging
        santa
          .optKeyString("EventLogType", santaConfig.eventLogType)
          .optKeyString("EventLogPath", santaConfig.eventLogPath);

        if (santaConfig.telemetry && santaConfig.telemetry.length > 0) {
          santa.keyArray("Telemetry", (arr) => {
            for (const t of santaConfig.telemetry!) arr.string(t);
          });
        }

        santa
          .optKeyString("FileChangesRegex", santaConfig.fileChangesRegex)
          .optKeyBool("EnableMachineIDDecoration", santaConfig.enableMachineIDDecoration);

        // Removable Media
        santa.optKeyBool("BlockUSBMount", santaConfig.blockUSBMount);

        if (santaConfig.remountUSBMode && santaConfig.remountUSBMode.length > 0) {
          santa.keyArray("RemountUSBMode", (arr) => {
            for (const m of santaConfig.remountUSBMode!) arr.string(m);
          });
        }

        santa.optKeyString("OnStartUSBOptions", santaConfig.onStartUSBOptions);

        // Metrics
        santa
          .optKeyString("MetricFormat", santaConfig.metricFormat)
          .optKeyString("MetricURL", santaConfig.metricURL)
          .optKeyInteger("MetricExportInterval", santaConfig.metricExportInterval);

        if (
          santaConfig.metricExtraLabels &&
          Object.keys(santaConfig.metricExtraLabels).length > 0
        ) {
          santa.keyDict("MetricExtraLabels", (d) => {
            for (const [k, v] of Object.entries(santaConfig.metricExtraLabels!)) {
              d.keyString(k, v);
            }
          });
        }

        // Payload metadata
        santa
          .keyString("PayloadDisplayName", "Santa")
          .keyString("PayloadType", "com.northpolesec.santa")
          .keyInteger("PayloadVersion", 1)
          .keyString("PayloadUUID", santaUuid)
          .keyString("PayloadIdentifier", `com.northpolesec.santa.${santaUuid}`);
      });
    });

    root
      .keyString("PayloadDisplayName", "Santa")
      .keyBool("PayloadEnabled", true)
      .keyString("PayloadType", "Configuration")
      .keyString("PayloadScope", "System")
      .keyString("PayloadUUID", outerUuid)
      .keyString("PayloadIdentifier", "com.northpolesec.santa");
  });
}
