import type { FileAccessPolicyEntry } from "../types.js";
import { audioPlugins } from "./file/audio-plugins.js";
import { chromeCookies } from "./file/chrome-cookies.js";
import { dockerSettings } from "./file/docker.js";
import { iMessage } from "./file/imessage.js";
import { inMemoryLoading } from "./file/in-memory-loading.js";
import { keychain } from "./file/keychain.js";
import { launchItems } from "./file/launch-items.js";
import { onePassword } from "./file/one-password.js";
import { pamProtection } from "./file/pam.js";
import { passwordHashes } from "./file/password-hashes.js";
import { spotlight } from "./file/spotlight.js";
import { ssh } from "./file/ssh.js";

export { electronV8Heap } from "./file/lib/electron.js";

export const filePresets: {
  readonly ssh: Record<string, FileAccessPolicyEntry>;
  readonly chromeCookies: Record<string, FileAccessPolicyEntry>;
  readonly onePassword: Record<string, FileAccessPolicyEntry>;
  readonly iMessage: Record<string, FileAccessPolicyEntry>;
  readonly keychain: Record<string, FileAccessPolicyEntry>;
  readonly launchItems: Record<string, FileAccessPolicyEntry>;
  readonly pamProtection: Record<string, FileAccessPolicyEntry>;
  readonly dockerSettings: Record<string, FileAccessPolicyEntry>;
  readonly spotlight: Record<string, FileAccessPolicyEntry>;
  readonly passwordHashes: Record<string, FileAccessPolicyEntry>;
  readonly inMemoryLoading: Record<string, FileAccessPolicyEntry>;
  readonly audioPlugins: Record<string, FileAccessPolicyEntry>;
} = {
  ssh,
  chromeCookies,
  onePassword,
  iMessage,
  keychain,
  launchItems,
  pamProtection,
  dockerSettings,
  spotlight,
  passwordHashes,
  inMemoryLoading,
  audioPlugins,
};

export const fileConfigs: {
  readonly personal: Record<string, FileAccessPolicyEntry>;
  readonly recommended: Record<string, FileAccessPolicyEntry>;
} = {
  // High-usefulness: ssh, chromeCookies, onePassword
  personal: {
    ...ssh,
    ...chromeCookies,
    ...onePassword,
  },
  // Adds Medium-usefulness on top of personal: iMessage, keychain, launchItems, pamProtection, dockerSettings, spotlight
  recommended: {
    ...ssh,
    ...chromeCookies,
    ...onePassword,
    ...iMessage,
    ...keychain,
    ...launchItems,
    ...pamProtection,
    ...dockerSettings,
    ...spotlight,
  },
};
