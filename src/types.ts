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

export enum ClientMode {
  Monitor = 1,
  Lockdown = 2,
  Standalone = 3,
}

/** Explicit wrapper for plist `<data>` values. */
export class PlistData {
  private constructor(private readonly base64Value: string) {}

  static fromBase64(base64: string): PlistData {
    const normalized = base64.replace(/\s+/g, "");
    const bytes = Buffer.from(normalized, "base64");

    if (bytes.length === 0 && normalized !== "") {
      throw new Error("Invalid base64 data");
    }

    if (bytes.toString("base64") !== normalized) {
      throw new Error("Invalid base64 data");
    }

    return new PlistData(normalized);
  }

  static fromBytes(bytes: ArrayBuffer | ArrayBufferView): PlistData {
    const view =
      bytes instanceof ArrayBuffer
        ? new Uint8Array(bytes)
        : new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    return new PlistData(Buffer.from(view).toString("base64"));
  }

  toBase64(): string {
    return this.base64Value;
  }
}

/** Explicit wrapper for plist `<real>` values. */
export class PlistReal {
  private constructor(private readonly numericValue: number) {}

  static fromNumber(value: number): PlistReal {
    return new PlistReal(value);
  }

  toNumber(): number {
    return this.numericValue;
  }
}

/** A static set of rules to always apply to the host. */
export interface StaticRule {
  RuleType: RuleType;
  Policy: RulePolicy;
  Identifier: string;
  CustomMsg?: string;
  CustomURL?: string;
  Comment?: string;
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
  Path: string;
  /**
   * Boolean indicating whether the path represents prefix matching. When
   * `true`, the rule will match files nested inside directories.
   */
  IsPrefix?: boolean;
}

/** A process matcher for FAA rules. */
export interface ProcessEntry {
  /** Signing ID, e.g. `EQHXZ8M8AV:com.google.Chrome.helper`. */
  SigningID?: string;
  /** Team ID, e.g. `ZMCG7MLDV9`. */
  TeamID?: string;
  /** Match platform binaries. */
  PlatformBinary?: boolean;
  /** CDHash, e.g. `397d55ebec87943ea3c3fe6b4d4f47edc490d25e`. */
  CDHash?: string;
  /** Leaf certificate SHA-256 hash. */
  CertificateSha256?: string;
  /** Binary path, e.g. `/Applications/Safari.app/Contents/MacOS/Safari`. */
  BinaryPath?: string;
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
  RuleType?:
    | "PathsWithAllowedProcesses"
    | "PathsWithDeniedProcesses"
    | "ProcessesWithAllowedPaths"
    | "ProcessesWithDeniedPaths";
  /** If true, reads will be permitted and only write-like access will be evaluated. */
  AllowReadAccess?: boolean;
  /** If true, operations are only logged and not blocked. */
  AuditOnly?: boolean;
  /**
   * Rule-specific URL that overrides the top-level `EventDetailURL`.
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
  EventDetailURL?: string;
  /** Button label text for the notification dialog, maximum 48 characters. Defaults to `Open`. */
  EventDetailText?: string;
  /** The message shown to the user when access is blocked for this rule. */
  BlockMessage?: string;
  /** If true, Santa GUI notifications for this rule are suppressed. */
  EnableSilentMode?: boolean;
  /** If true, TTY notifications for this rule are suppressed. */
  EnableSilentTTYMode?: boolean;
}

/** An individual FAA watch rule. */
export interface FileAccessPolicyEntry {
  /** Array of path patterns to monitor. */
  Paths: FileAccessPathEntry[];
  /** Settings for rule behavior. */
  Options: FileAccessPolicyOptions;
  /** List of allowed or denied processes with specific identifiers. */
  Processes?: ProcessEntry[];
}

/** A complete FAA policy. */
export interface FileAccessPolicy {
  /** Policy version identifier that will be reported in events. */
  Version: string;
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
  EventDetailURL?: string;
  /** Button label text for the notification dialog, maximum 48 characters. Defaults to `Open`. */
  EventDetailText?: string;
  /** Dictionary containing the individual monitoring rules. */
  WatchItems?: Record<string, FileAccessPolicyEntry>;
}

/** Santa configuration keys. */
export interface SantaConfig {
  // General
  /**
   * The client mode that Santa should operate in.
   *
   * This enum corresponds to the upstream plist values:
   * - `ClientMode.Monitor` => `1` (Monitor): Executions of binaries not covered by a rule will be allowed
   * - `ClientMode.Lockdown` => `2` (Lockdown): Executions of binaries not covered by a rule will be blocked
   * - `ClientMode.Standalone` => `3` (Standalone): Executions of binaries not covered by a rule will trigger an authorization dialog
   */
  ClientMode?: ClientMode;
  /** If true, Santa will fail closed if it cannot establish a database connection. */
  FailClosed?: boolean;
  /** If true, standalone mode can fall back to a password prompt when sync is unavailable. */
  EnableStandalonePasswordFallback?: boolean;
  /** If true, Santa will ignore the presence of other Endpoint Security clients. */
  IgnoreOtherEndpointSecurityClients?: boolean;
  /** If true, Santa will collect anonymous stats. */
  EnableStatsCollection?: boolean;
  /** Organization ID associated with stats collection. */
  StatsOrganizationID?: string;

  // Sync
  /** Base URL used for syncing with the Santa server. */
  SyncBaseURL?: string;
  /** If true, use protobuf for sync transfer when supported. */
  SyncEnableProtoTransfer?: boolean;
  /** Proxy settings used for sync communication. */
  SyncProxyConfiguration?: SyncProxyConfig;
  /** If true, events will be uploaded to the sync server even if a clean sync is requested. */
  SyncEnableCleanSyncEventUpload?: boolean;
  /** Client certificate file used for mutual TLS authentication. */
  ClientAuthCertificateFile?: string;
  /** Password for the client authentication certificate file. */
  ClientAuthCertificatePassword?: string;
  /** Common Name of a certificate in the System keychain to use for sync authentication. */
  ClientAuthCertificateCN?: string;
  /** Issuer Common Name of a certificate in the System keychain to use for sync authentication. */
  ClientAuthCertificateIssuerCN?: string;
  /** File containing root certificates used to authenticate the server. */
  ServerAuthRootsFile?: string;
  /** PEM-encoded root certificates used to authenticate the server, wrapped as plist data. */
  ServerAuthRootsData?: PlistData;
  /** Machine identifier to include in sync requests and logs. */
  MachineID?: string;
  /** Machine owner value to send to the sync server. */
  MachineOwner?: string;
  /** Path to a plist containing the machine owner. */
  MachineOwnerPlist?: string;
  /** Machine owner groups to send to the sync server. */
  MachineOwnerGroups?: string[];
  /** If true, upload all events rather than only the usual subset. */
  EnableAllEventUpload?: boolean;
  /** If true, unknown events will not be uploaded to the sync server. */
  DisableUnknownEventUpload?: boolean;

  // GUI
  /** If true, GUI notifications are suppressed. */
  EnableSilentMode?: boolean;
  /** If true, TTY notifications are suppressed. */
  EnableSilentTTYMode?: boolean;
  /** If true, the Santa menu item is shown. */
  EnableMenuItem?: boolean;
  /** Text shown in the About window. */
  AboutText?: string;
  /** URL opened from Santa UI for additional information. */
  MoreInfoURL?: string;
  /** Global URL displayed when users receive block notifications. Supports variable substitution. */
  EventDetailURL?: string;
  /** Button text associated with `EventDetailURL`. */
  EventDetailText?: string;
  /** Global URL displayed when users receive file-access block notifications. */
  FileAccessEventDetailURL?: string;
  /** Button text associated with `FileAccessEventDetailURL`. */
  FileAccessEventDetailText?: string;
  /** Text shown on the dismiss button in the block dialog. */
  DismissText?: string;
  /** Message shown when an unknown binary is blocked. */
  UnknownBlockMessage?: string;
  /** Message shown when a binary is blocked by a rule without a custom message. */
  BannedBlockMessage?: string;
  /** Notification text displayed when entering monitor mode. */
  ModeNotificationMonitor?: string;
  /** Notification text displayed when entering lockdown mode. */
  ModeNotificationLockdown?: string;
  /** Message displayed when a USB device is prevented from being mounted. */
  BannedUSBBlockMessage?: string;
  /** Message displayed when a USB device is remounted with restricted flags. */
  RemountUSBBlockMessage?: string;
  /** Default message shown when a file-access rule blocks access. */
  FileAccessBlockMessage?: string;
  /** If false, users will not be presented with an option to silence notifications. */
  EnableNotificationSilences?: boolean;
  /** Company name to display on Santa GUIs and in TTY messages. */
  BrandingCompanyName?: string;
  /**
   * A URL referencing a logo image to display on Santa UIs.
   *
   * Supported URL schemes:
   * - `file://` - Local file path, e.g. `file:///Library/Application%20Support/MyOrg/logo.png`
   * - `data:` - Base64-encoded image data, e.g. `data:image/png;base64,iVBORw0KG...`
   *
   * Note: HTTP/HTTPS URLs are not supported.
   */
  BrandingCompanyLogo?: string;
  /**
   * A URL referencing a logo image to display on Santa UIs in dark mode.
   *
   * Supported URL schemes:
   * - `file://`
   * - `data:`
   */
  BrandingCompanyLogoDark?: string;
  /** If true, the Santa UI will use special images/fonts on certain holidays. */
  FunFontsOnSpecificDays?: boolean;

  // File-Access Authorization
  /** A complete file access configuration policy embedded in the main Santa config. */
  FileAccessPolicy?: FileAccessPolicy;
  /** Path to a file access configuration plist. Ignored if `FileAccessPolicy` is also set. */
  FileAccessPolicyPlist?: string;
  /** Seconds between re-reading the file access policy config. */
  FileAccessPolicyUpdateIntervalSec?: number;
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
  OverrideFileAccessAction?: "AUDIT_ONLY" | "DISABLE" | "none";
  /** Average logs per second emitted by FAA rule violations. */
  FileAccessGlobalLogsPerSec?: number;
  /** Window size over which FAA log rate limiting is applied. */
  FileAccessGlobalWindowSizeSec?: number;

  // Rules
  /** A regex to allow if the binary, certificate, or Team ID scopes did not allow or block execution. */
  AllowedPathRegex?: string;
  /** A regex to block if the binary, certificate, or Team ID scopes did not allow or block execution. */
  BlockedPathRegex?: string;
  /** If true, binaries with a bad signing chain will be blocked even in monitor mode unless explicitly allowed. */
  EnableBadSignatureProtection?: boolean;
  /** If true, 32-bit binaries missing the `__PAGEZERO` segment will be blocked even in monitor mode unless explicitly allowed. */
  EnablePageZeroProtection?: boolean;
  /** If true, Santa will respect compiler rules and create allow rules for produced executables. */
  EnableTransitiveRules?: boolean;
  /** A static set of rules to always apply to the host. */
  StaticRules?: StaticRule[];

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
  EventLogType?: "syslog" | "file" | "protobuf" | "json" | "null";
  /** Path used to save logs when `EventLogType` is `file` or `json`. */
  EventLogPath?: string;
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
  Telemetry?: TelemetryEvent[];
  /** The regex of paths to log file changes. */
  FileChangesRegex?: string;
  /** Array of path prefixes that should be excluded from file-change logging. */
  FileChangesPrefixFilters?: string[];
  /** Base directory used to save protobuf spool files. */
  SpoolDirectory?: string;
  /** Per-file size limit in KB for files stored in the protobuf spool directory. */
  SpoolDirectoryFileSizeThresholdKB?: number;
  /** Total combined size limit in MB of all protobuf spool directory files. */
  SpoolDirectorySizeThresholdMB?: number;
  /** Max seconds to buffer protobuf events before flushing to disk. */
  SpoolDirectoryEventMaxFlushTimeSec?: number;
  /** If true, the `MachineID` will be added to each log entry. */
  EnableMachineIDDecoration?: boolean;
  /** Entitlement prefixes to omit from execution telemetry. */
  EntitlementsPrefixFilter?: string[];
  /** Team IDs whose entitlements should be omitted from execution telemetry. */
  EntitlementsTeamIDFilter?: string[];
  /** CEL expressions used for filtering/redacting telemetry rows before upload. */
  TelemetryFilterExpressions?: string[];

  // Removable Media
  /** If true, blocking Removable Media (e.g. USB Mass storage) is enabled. */
  BlockUSBMount?: boolean;
  /**
   * Array of strings for arguments to pass to `mount -o` when forcibly
   * remounting devices.
   */
  RemountUSBMode?: RemountUSBMode[];
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
  OnStartUSBOptions?: "Unmount" | "ForceUnmount" | "Remount" | "ForceRemount";

  // Metrics
  /**
   * Format to export metrics as.
   *
   * Allowed values:
   * - `rawjson`: A single JSON blob containing all metrics
   * - `monarchjson`: A format consumable by Google's internal Monarch tooling
   */
  MetricFormat?: "rawjson" | "monarchjson";
  /** URL describing where monitoring metrics should be exported. */
  MetricURL?: string;
  /** Number of seconds to wait between exporting metrics. */
  MetricExportInterval?: number;
  /** Number of seconds to wait before metric export times out. */
  MetricExportTimeout?: number;
  /** Key-value pairs to add to all metric root labels. */
  MetricExtraLabels?: Record<string, string>;
}

export interface SantaGiftConfig {
  /** Options controlling generated output. */
  generationOptions: GenerationOptions;
  /** Santa configuration keys. */
  santaConfig: SantaConfig;
}
