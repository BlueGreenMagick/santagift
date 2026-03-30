export interface GenerationOptions {
  outFile?: string;
}

export type RemountUSBMode =
  | "rdonly"
  | "noexec"
  | "nosuid"
  | "nobrowse"
  | "noowners"
  | "nodev"
  | "async";

export type RuleType =
  | "BINARY"
  | "CERTIFICATE"
  | "TEAMID"
  | "SIGNINGID"
  | "CDHASH";

export type RulePolicy =
  | "ALLOWLIST"
  | "BLOCKLIST"
  | "ALLOWLIST_COMPILER"
  | "SILENT_BLOCKLIST";

export interface StaticRule {
  ruleType: RuleType;
  policy: RulePolicy;
  identifier: string;
  customMsg?: string;
  customURL?: string;
  comment?: string;
}

export interface SyncProxyConfig {
  HTTPEnable?: boolean;
  HTTPProxy?: string;
  HTTPPort?: number;
  HTTPSEnable?: boolean;
  HTTPSProxy?: string;
  HTTPSPort?: number;
  ProxyAutoConfigEnable?: boolean;
  ProxyAutoConfigURLString?: string;
}

export interface FileAccessPathEntry {
  path: string;
  isPrefix?: boolean;
}

export interface ProcessEntry {
  signingId?: string;
  teamId?: string;
  platformBinary?: boolean;
  cdHash?: string;
  certificateSha256?: string;
  binaryPath?: string;
}

export interface FileAccessPolicyOptions {
  ruleType?:
    | "PathsWithAllowedProcesses"
    | "PathsWithDeniedProcesses"
    | "ProcessesWithAllowedPaths"
    | "ProcessesWithDeniedPaths";
  allowReadAccess?: boolean;
  auditOnly?: boolean;
  eventDetailURL?: string;
  eventDetailText?: string;
  blockMessage?: string;
  enableSilentMode?: boolean;
  enableSilentTTYMode?: boolean;
}

export interface FileAccessPolicyEntry {
  paths: FileAccessPathEntry[];
  options: FileAccessPolicyOptions;
  processes?: ProcessEntry[];
}

export interface FileAccessPolicy {
  version: string;
  eventDetailURL?: string;
  eventDetailText?: string;
  watchItems?: Record<string, FileAccessPolicyEntry>;
}

export interface SantaConfig {
  // General
  clientMode?: "monitor" | "lockdown" | "standalone";
  failClosed?: boolean;
  enableStandalonePasswordFallback?: boolean;
  ignoreOtherEndpointSecurityClients?: boolean;
  enableStatsCollection?: boolean;
  statsOrganizationID?: string;

  // Sync
  syncBaseURL?: string;
  syncEnableProtoTransfer?: boolean;
  syncProxyConfiguration?: SyncProxyConfig;
  clientAuthCertificateFile?: string;
  clientAuthCertificatePassword?: string;
  serverAuthRootsFile?: string;
  serverAuthRootsData?: string;
  machineID?: string;
  machineOwner?: string;
  machineOwnerGroups?: string[];
  enableAllEventUpload?: boolean;

  // GUI
  enableSilentMode?: boolean;
  enableMenuItem?: boolean;
  aboutText?: string;
  moreInfoURL?: string;
  eventDetailURL?: string;
  unknownBlockMessage?: string;
  brandingCompanyName?: string;
  brandingLogo?: string;

  // File-Access Authorization
  fileAccessPolicy?: FileAccessPolicy;
  fileAccessPolicyPlist?: string;
  overrideFileAccessAction?: "AUDIT_ONLY" | "DISABLE";
  fileAccessGlobalLogsPerSec?: number;

  // Rules
  allowedPathRegex?: string;
  blockedPathRegex?: string;
  enableBadSignatureProtection?: boolean;
  enablePageZeroProtection?: boolean;
  staticRules?: StaticRule[];

  // Telemetry & Logging
  eventLogType?: "syslog" | "file" | "protobuf" | "json" | "null";
  eventLogPath?: string;
  telemetry?: string[];
  fileChangesRegex?: string;
  enableMachineIDDecoration?: boolean;

  // Removable Media
  blockUSBMount?: boolean;
  remountUSBMode?: RemountUSBMode[];
  onStartUSBOptions?: "Unmount" | "ForceUnmount" | "Remount" | "ForceRemount";

  // Metrics
  metricFormat?: "rawjson" | "monarchjson";
  metricURL?: string;
  metricExportInterval?: number;
  metricExtraLabels?: Record<string, string>;
}

export interface SantaGiftConfig {
  generationOptions: GenerationOptions;
  santaConfig: SantaConfig;
}
