export interface GenerationOptions {
  outFile?: string;
}

export interface SantaConfig {
  clientMode?: "monitor" | "lockdown";
  failClosed?: boolean;
  fileAccessPolicy?: Record<string, FileAccessPolicyEntry>;
}

export interface FileAccessPolicyEntry {
  paths: PathEntry[];
  options: PolicyOptions;
  processes?: ProcessEntry[];
}

export interface PathEntry {
  path: string;
  isPrefix?: boolean;
}

export interface PolicyOptions {
  allowReadAccess?: boolean;
  auditOnly?: boolean;
  ruleType?: "PathsWithAllowedProcesses" | "AllPaths";
}

export interface ProcessEntry {
  signingId?: string;
  teamId?: string;
  platformBinary?: boolean;
}

export interface SantaGiftConfig {
  generationOptions: GenerationOptions;
  santaConfig: SantaConfig;
}

export function defineConfig(
  generationOptions: GenerationOptions,
  santaConfig: SantaConfig
): SantaGiftConfig {
  return { generationOptions, santaConfig };
}
