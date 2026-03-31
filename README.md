# santagift

A TypeScript config generator for [Santa](https://github.com/northpolesec/santa), Google's binary authorization system for macOS. Write your Santa configuration in TypeScript and generate a `.mobileconfig` plist ready for use.

## Installing Santa

```sh
brew install santa  # requires root password
```

After installing:

1. Go to **Settings > Login Items & Extensions** and allow Santa.app's security extension and app background activity.
2. Go to **Settings > Privacy & Security > Full Disk Access** and allow Santa.

Verify the installation:

```sh
/usr/local/bin/santactl status
sudo santactl doctor
```

## Installation

```bash
npm install santagift
# or
pnpm add santagift
```

## Usage

```bash
mkdir my-santa-config && cd my-santa-config
pnpm init
pnpm add santagift
```

Create a `santa.config.ts`:

```ts
import { defineConfig } from "santagift";

export default defineConfig(
  {
    outFile: "santa.mobileconfig",
  },
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
    ],
  },
);
```

Generate the config:

```bash
pnpm santaconfig
```

This writes `santa.mobileconfig` to the current directory. To apply it:

1. Double-click `santa.mobileconfig`.
2. Go to **Settings > Privacy Downloaded > Device Management** and install the profile.

```bash
pnpm santaconfig --config path/to/other.config.ts   # use a custom config file
```

## API

### `defineConfig(generationOptions, santaConfig)`

The primary helper for defining a typed Santa configuration.

- **`generationOptions`** — santagift tool-specific options, e.g. the output file path.
- **`santaConfig`** — the Santa configuration payload. All keys map directly to Santa's configuration keys.

For a full reference of available configuration keys and what they do, see:
- [Santa Config Docs](https://northpole.dev/configuration/keys/)
- [Santa Config File-Access Authorization Docs](https://northpole.dev/configuration/faa/)

## Logs

To filter file-access events:

```sh
# default path. Change the path if you customized `EventLogPath` config
grep "FILE_ACCESS" /var/db/santa/santa.log
```

## Development

**Requirements:** [mise](https://mise.jdx.dev)

```bash
mise i         # Install required tools
pnpm install   # install dependencies
pnpm build     # build to dist/
pnpm lint      # lint with biome
pnpm lint:fix  # fix lints and formatting
```
