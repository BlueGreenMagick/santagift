export type {
  FileAccessPathEntry,
  FileAccessPolicy,
  FileAccessPolicyEntry,
  FileAccessPolicyOptions,
  GenerationOptions,
  ProcessEntry,
  RemountUSBMode,
  RulePolicy,
  RuleType,
  SantaConfig,
  SantaGiftConfig,
  StaticRule,
  SyncProxyConfig,
  TelemetryEvent,
} from "./types.js";

import type { GenerationOptions, SantaConfig, SantaGiftConfig } from "./types.js";

export function defineConfig(
  generationOptions: GenerationOptions,
  santaConfig: SantaConfig,
): SantaGiftConfig {
  return { generationOptions, santaConfig };
}
