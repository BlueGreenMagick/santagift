/** Options controlling generated output. */
export interface GenerationOptions {
  /** Output path for the generated plist. */
  outFile?: string;
}

/**
 * Arguments to pass to `mount -o` when forcibly remounting devices.
 *
 * Allowed values:
 * - `rdonly`
 * - `noexec`
 * - `nosuid`
 * - `nobrowse`
 * - `noowners`
 * - `nodev`
 * - `async`
 */
export type RemountUSBMode =
  | "rdonly"
  | "noexec"
  | "nosuid"
  | "nobrowse"
  | "noowners"
  | "nodev"
  | "async"
  | "-j";

export type TelemetryEvent =
  | "Everything"
  | "Execution"
  | "Fork"
  | "Exit"
  | "Close"
  | "Rename"
  | "Unlink"
  | "Link"
  | "ExchangeData"
  | "Disk"
  | "Bundle"
  | "Allowlist"
  | "FileAccess"
  | "CodesigningInvalidated"
  | "LoginWindowSession"
  | "LoginLogout"
  | "ScreenSharing"
  | "OpenSSH"
  | "Authentication"
  | "Clone"
  | "Copyfile"
  | "GatekeeperOverride"
  | "LaunchItem"
  | "TCCModification"
  | "XProtect"
  | "None";

export type RuleType = "BINARY" | "CERTIFICATE" | "TEAMID" | "SIGNINGID" | "CDHASH";

export type RulePolicy = "ALLOWLIST" | "BLOCKLIST" | "ALLOWLIST_COMPILER" | "SILENT_BLOCKLIST";

/** A static set of rules to always apply to the host. */
export interface StaticRule {
  ruleType: RuleType;
  policy: RulePolicy;
  identifier: string;
  customMsg?: string;
  customURL?: string;
  comment?: string;
}

/** Proxy configuration used for sync communication. */
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

/** A path pattern to monitor. */
export interface FileAccessPathEntry {
  /**
   * The path pattern to monitor.
   *
   * Examples:
   * - Exact path: `/etc/sudoers`
   * - Wildcard: `/Users/*\/Documents/*`
   */
  path: string;
  /**
   * Boolean indicating whether the path represents prefix matching. When
   * `true`, the rule will match files nested inside directories.
   */
  isPrefix?: boolean;
}

/** A process matcher for FAA rules. */
export interface ProcessEntry {
  /** Signing ID, e.g. `EQHXZ8M8AV:com.google.Chrome.helper`. */
  signingId?: string;
  /** Team ID, e.g. `ZMCG7MLDV9`. */
  teamId?: string;
  /** Match platform binaries. */
  platformBinary?: boolean;
  /** CDHash, e.g. `397d55ebec87943ea3c3fe6b4d4f47edc490d25e`. */
  cdHash?: string;
  /** Leaf certificate SHA-256 hash. */
  certificateSha256?: string;
  /** Binary path, e.g. `/Applications/Safari.app/Contents/MacOS/Safari`. */
  binaryPath?: string;
}

/** Settings for FAA rule behavior. */
export interface FileAccessPolicyOptions {
  /**
   * Defines whether the rule is data-centric or process-centric.
   *
   * Allowed values:
   * - `PathsWithAllowedProcesses`: Data-centric, only listed processes can access the paths.
   * - `PathsWithDeniedProcesses`: Data-centric, listed processes cannot access the paths.
   * - `ProcessesWithAllowedPaths`: Process-centric, listed processes can only access specified paths.
   * - `ProcessesWithDeniedPaths`: Process-centric, listed processes cannot access specified paths.
   *
   * Choose a `PathsWith...` rule to protect specific files or paths from
   * unauthorized access. Choose a `ProcessesWith...` rule to restrict what a
   * specific process can access.
   */
  ruleType?:
    | "PathsWithAllowedProcesses"
    | "PathsWithDeniedProcesses"
    | "ProcessesWithAllowedPaths"
    | "ProcessesWithDeniedPaths";
  /** If true, reads will be permitted and only write-like access will be evaluated. */
  allowReadAccess?: boolean;
  /** If true, operations are only logged and not blocked. */
  auditOnly?: boolean;
  /**
   * Rule-specific URL that overrides the top-level `eventDetailURL`.
   *
   * Supported placeholders:
   * - `%rule_version%`: Version of the rule that was violated
   * - `%rule_name%`: Name of the rule that was violated
   * - `%file_identifier%`: SHA-256 of the binary that was being executed
   * - `%accessed_path%`: The path that was being accessed
   * - `%username%`: The executing user
   * - `%team_id%`: The team ID that signed this binary, if any
   * - `%signing_id%`: The signing ID of this binary, if any
   * - `%cdhash%`: The binary's CDHash, if any
   * - `%machine_id%`: The ID of the machine
   * - `%serial%`: The serial number of the machine
   * - `%uuid%`: The hardware UUID of the machine
   * - `%hostname%`: The system's full hostname
   *
   * @example
   * "https://sync-server-hostname/%machine_id%/%rule_name%/%rule_version%"
   */
  eventDetailURL?: string;
  /** Button label text for the notification dialog, maximum 48 characters. Defaults to `Open`. */
  eventDetailText?: string;
  /** The message shown to the user when access is blocked for this rule. */
  blockMessage?: string;
  /** If true, Santa GUI notifications for this rule are suppressed. */
  enableSilentMode?: boolean;
  /** If true, TTY notifications for this rule are suppressed. */
  enableSilentTTYMode?: boolean;
}

/** An individual FAA watch rule. */
export interface FileAccessPolicyEntry {
  /** Array of path patterns to monitor. */
  paths: FileAccessPathEntry[];
  /** Settings for rule behavior. */
  options: FileAccessPolicyOptions;
  /** List of allowed or denied processes with specific identifiers. */
  processes?: ProcessEntry[];
}

/** A complete FAA policy. */
export interface FileAccessPolicy {
  /** Policy version identifier that will be reported in events. */
  version: string;
  /**
   * URL displayed when users receive block notifications.
   *
   * Supported placeholders:
   * - `%rule_version%`: Version of the rule that was violated
   * - `%rule_name%`: Name of the rule that was violated
   * - `%file_identifier%`: SHA-256 of the binary that was being executed
   * - `%accessed_path%`: The path that was being accessed
   * - `%username%`: The executing user
   * - `%team_id%`: The team ID that signed this binary, if any
   * - `%signing_id%`: The signing ID of this binary, if any
   * - `%cdhash%`: The binary's CDHash, if any
   * - `%machine_id%`: The ID of the machine
   * - `%serial%`: The serial number of the machine
   * - `%uuid%`: The hardware UUID of the machine
   * - `%hostname%`: The system's full hostname
   *
   * @example
   * "https://sync-server-hostname/%machine_id%/%rule_name%/%rule_version%"
   */
  eventDetailURL?: string;
  /** Button label text for the notification dialog, maximum 48 characters. Defaults to `Open`. */
  eventDetailText?: string;
  /** Dictionary containing the individual monitoring rules. */
  watchItems?: Record<string, FileAccessPolicyEntry>;
}

/** Santa configuration keys. */
export interface SantaConfig {
  // General
  /**
   * The client mode that Santa should operate in.
   *
   * This string union corresponds to the upstream plist values:
   * - `monitor` => `1` (Monitor): Executions of binaries not covered by a rule will be allowed
   * - `lockdown` => `2` (Lockdown): Executions of binaries not covered by a rule will be blocked
   * - `standalone` => `3` (Standalone): Executions of binaries not covered by a rule will trigger an authorization dialog
   */
  clientMode?: "monitor" | "lockdown" | "standalone";
  /** If true, Santa will fail closed if it cannot establish a database connection. */
  failClosed?: boolean;
  /** If true, standalone mode can fall back to a password prompt when sync is unavailable. */
  enableStandalonePasswordFallback?: boolean;
  /** If true, Santa will ignore the presence of other Endpoint Security clients. */
  ignoreOtherEndpointSecurityClients?: boolean;
  /** If true, Santa will collect anonymous stats. */
  enableStatsCollection?: boolean;
  /** Organization ID associated with stats collection. */
  statsOrganizationID?: string;

  // Sync
  /** Base URL used for syncing with the Santa server. */
  syncBaseURL?: string;
  /** If true, use protobuf for sync transfer when supported. */
  syncEnableProtoTransfer?: boolean;
  /** Proxy settings used for sync communication. */
  syncProxyConfiguration?: SyncProxyConfig;
  /** If true, events will be uploaded to the sync server even if a clean sync is requested. */
  syncEnableCleanSyncEventUpload?: boolean;
  /** Client certificate file used for mutual TLS authentication. */
  clientAuthCertificateFile?: string;
  /** Password for the client authentication certificate file. */
  clientAuthCertificatePassword?: string;
  /** Common Name of a certificate in the System keychain to use for sync authentication. */
  clientAuthCertificateCN?: string;
  /** Issuer Common Name of a certificate in the System keychain to use for sync authentication. */
  clientAuthCertificateIssuerCN?: string;
  /** File containing root certificates used to authenticate the server. */
  serverAuthRootsFile?: string;
  /** PEM-encoded root certificates used to authenticate the server. */
  serverAuthRootsData?: string;
  /** Machine identifier to include in sync requests and logs. */
  machineID?: string;
  /** Machine owner value to send to the sync server. */
  machineOwner?: string;
  /** Path to a plist containing the machine owner. */
  machineOwnerPlist?: string;
  /** Machine owner groups to send to the sync server. */
  machineOwnerGroups?: string[];
  /** If true, upload all events rather than only the usual subset. */
  enableAllEventUpload?: boolean;
  /** If true, unknown events will not be uploaded to the sync server. */
  disableUnknownEventUpload?: boolean;

  // GUI
  /** If true, GUI notifications are suppressed. */
  enableSilentMode?: boolean;
  /** If true, TTY notifications are suppressed. */
  enableSilentTTYMode?: boolean;
  /** If true, the Santa menu item is shown. */
  enableMenuItem?: boolean;
  /** Text shown in the About window. */
  aboutText?: string;
  /** URL opened from Santa UI for additional information. */
  moreInfoURL?: string;
  /** Global URL displayed when users receive block notifications. Supports variable substitution. */
  eventDetailURL?: string;
  /** Button text associated with `eventDetailURL`. */
  eventDetailText?: string;
  /** Global URL displayed when users receive file-access block notifications. */
  fileAccessEventDetailURL?: string;
  /** Button text associated with `fileAccessEventDetailURL`. */
  fileAccessEventDetailText?: string;
  /** Text shown on the dismiss button in the block dialog. */
  dismissText?: string;
  /** Message shown when an unknown binary is blocked. */
  unknownBlockMessage?: string;
  /** Message shown when a binary is blocked by a rule without a custom message. */
  bannedBlockMessage?: string;
  /** Notification text displayed when entering monitor mode. */
  modeNotificationMonitor?: string;
  /** Notification text displayed when entering lockdown mode. */
  modeNotificationLockdown?: string;
  /** Message displayed when a USB device is prevented from being mounted. */
  bannedUSBBlockMessage?: string;
  /** Message displayed when a USB device is remounted with restricted flags. */
  remountUSBBlockMessage?: string;
  /** Default message shown when a file-access rule blocks access. */
  fileAccessBlockMessage?: string;
  /** If false, users will not be presented with an option to silence notifications. */
  enableNotificationSilences?: boolean;
  /** Company name to display on Santa GUIs and in TTY messages. */
  brandingCompanyName?: string;
  /**
   * A URL referencing a logo image to display on Santa UIs.
   *
   * Supported URL schemes:
   * - `file://` - Local file path, e.g. `file:///Library/Application%20Support/MyOrg/logo.png`
   * - `data:` - Base64-encoded image data, e.g. `data:image/png;base64,iVBORw0KG...`
   *
   * Note: HTTP/HTTPS URLs are not supported.
   */
  brandingCompanyLogo?: string;
  /**
   * A URL referencing a logo image to display on Santa UIs in dark mode.
   *
   * Supported URL schemes:
   * - `file://`
   * - `data:`
   */
  brandingCompanyLogoDark?: string;
  /** If true, the Santa UI will use special images/fonts on certain holidays. */
  funFontsOnSpecificDays?: boolean;

  // File-Access Authorization
  /** A complete file access configuration policy embedded in the main Santa config. */
  fileAccessPolicy?: FileAccessPolicy;
  /** Path to a file access configuration plist. Ignored if `fileAccessPolicy` is also set. */
  fileAccessPolicyPlist?: string;
  /** Seconds between re-reading the file access policy config. */
  fileAccessPolicyUpdateIntervalSec?: number;
  /**
   * Defines a global override policy that applies to the enforcement of all
   * FAA rules.
   *
   * Allowed values:
   * - `AUDIT_ONLY`: no access will be blocked, only logged
   * - `DISABLE`: no access will be blocked or logged
   * - `none`: enforce policy as defined in each rule
   *
   * Omitting this property has the same effect as `none`.
   */
  overrideFileAccessAction?: "AUDIT_ONLY" | "DISABLE" | "none";
  /** Average logs per second emitted by FAA rule violations. */
  fileAccessGlobalLogsPerSec?: number;
  /** Window size over which FAA log rate limiting is applied. */
  fileAccessGlobalWindowSizeSec?: number;

  // Rules
  /** A regex to allow if the binary, certificate, or Team ID scopes did not allow or block execution. */
  allowedPathRegex?: string;
  /** A regex to block if the binary, certificate, or Team ID scopes did not allow or block execution. */
  blockedPathRegex?: string;
  /** If true, binaries with a bad signing chain will be blocked even in monitor mode unless explicitly allowed. */
  enableBadSignatureProtection?: boolean;
  /** If true, 32-bit binaries missing the `__PAGEZERO` segment will be blocked even in monitor mode unless explicitly allowed. */
  enablePageZeroProtection?: boolean;
  /** If true, Santa will respect compiler rules and create allow rules for produced executables. */
  enableTransitiveRules?: boolean;
  /** A static set of rules to always apply to the host. */
  staticRules?: StaticRule[];

  // Telemetry & Logging
  /**
   * Defines how event logs are stored.
   *
   * Allowed values:
   * - `syslog`: Sent to the macOS Unified Logging System
   * - `file`: Sent to a file on disk
   * - `protobuf`: (BETA) Sent to file on disk using a maildir-like format
   * - `json`: (BETA) Same as file but output is one JSON object per line
   * - `null`: Don't output any event logs
   */
  eventLogType?: "syslog" | "file" | "protobuf" | "json" | "null";
  /** Path used to save logs when `eventLogType` is `file` or `json`. */
  eventLogPath?: string;
  /**
   * Array of strings for events that should be logged.
   *
   * Allowed values:
   * - `Everything`
   * - `Execution`
   * - `Fork`
   * - `Exit`
   * - `Close`
   * - `Rename`
   * - `Unlink`
   * - `Link`
   * - `ExchangeData`
   * - `Disk`
   * - `Bundle`
   * - `Allowlist`
   * - `FileAccess`
   * - `CodesigningInvalidated`
   * - `LoginWindowSession`
   * - `LoginLogout`
   * - `ScreenSharing`
   * - `OpenSSH`
   * - `Authentication`
   * - `Clone`
   * - `Copyfile`
   * - `GatekeeperOverride`
   * - `LaunchItem`
   * - `TCCModification`
   * - `XProtect`
   * - `None`
   */
  telemetry?: TelemetryEvent[];
  /** The regex of paths to log file changes. */
  fileChangesRegex?: string;
  /** Array of path prefixes that should be excluded from file-change logging. */
  fileChangesPrefixFilters?: string[];
  /** Base directory used to save protobuf spool files. */
  spoolDirectory?: string;
  /** Per-file size limit in KB for files stored in the protobuf spool directory. */
  spoolDirectoryFileSizeThresholdKB?: number;
  /** Total combined size limit in MB of all protobuf spool directory files. */
  spoolDirectorySizeThresholdMB?: number;
  /** Max seconds to buffer protobuf events before flushing to disk. */
  spoolDirectoryEventMaxFlushTimeSec?: number;
  /** If true, the `machineID` will be added to each log entry. */
  enableMachineIDDecoration?: boolean;
  /** Entitlement prefixes to omit from execution telemetry. */
  entitlementsPrefixFilter?: string[];
  /** Team IDs whose entitlements should be omitted from execution telemetry. */
  entitlementsTeamIDFilter?: string[];
  /** CEL expressions used for filtering/redacting telemetry rows before upload. */
  telemetryFilterExpressions?: string[];

  // Removable Media
  /** If true, blocking Removable Media (e.g. USB Mass storage) is enabled. */
  blockUSBMount?: boolean;
  /**
   * Array of strings for arguments to pass to `mount -o` when forcibly
   * remounting devices.
   */
  remountUSBMode?: RemountUSBMode[];
  /**
   * If set, defines the action that should be taken on existing removable
   * media mounts when Santa starts up.
   *
   * Allowed values:
   * - `Unmount`
   * - `ForceUnmount`
   * - `Remount`
   * - `ForceRemount`
   *
   * Note: "remounts" are implemented by first unmounting and then mounting the
   * device again.
   */
  onStartUSBOptions?: "Unmount" | "ForceUnmount" | "Remount" | "ForceRemount";

  // Metrics
  /**
   * Format to export metrics as.
   *
   * Allowed values:
   * - `rawjson`: A single JSON blob containing all metrics
   * - `monarchjson`: A format consumable by Google's internal Monarch tooling
   */
  metricFormat?: "rawjson" | "monarchjson";
  /** URL describing where monitoring metrics should be exported. */
  metricURL?: string;
  /** Number of seconds to wait between exporting metrics. */
  metricExportInterval?: number;
  /** Number of seconds to wait before metric export times out. */
  metricExportTimeout?: number;
  /** Key-value pairs to add to all metric root labels. */
  metricExtraLabels?: Record<string, string>;
}

export interface SantaGiftConfig {
  /** Options controlling generated output. */
  generationOptions: GenerationOptions;
  /** Santa configuration keys. */
  santaConfig: SantaConfig;
}
