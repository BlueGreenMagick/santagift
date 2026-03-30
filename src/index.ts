export type {
  GenerationOptions,
  RemountUSBMode,
  RuleType,
  RulePolicy,
  StaticRule,
  SyncProxyConfig,
  FileAccessPathEntry,
  ProcessEntry,
  FileAccessPolicyOptions,
  FileAccessPolicyEntry,
  FileAccessPolicy,
  SantaConfig,
  SantaGiftConfig,
} from "./types.js";

import type { GenerationOptions, SantaConfig, SantaGiftConfig } from "./types.js";

export function defineConfig(
  generationOptions: GenerationOptions,
  santaConfig: SantaConfig,
): SantaGiftConfig {
  return { generationOptions, santaConfig };
}
