# santagift

A TypeScript config generator for [Santa](https://github.com/northpolesec/santa), Google's binary authorization system for macOS. Write your Santa configuration in TypeScript and generate a `.mobileconfig` plist ready for use.

Features:
- Automatically generate `.mobileconfig` plist file from typescript
- Typescript type hints
- Common File-Access configuration presets (todo)
- Test that File-Access configuration has been applied correctly (todo)

## Presets
santagift ships with pre-configured presets for File Access Authorization policies.

The presets are designed to help detect and prevent exfilteration of sensitive data. It assumes that the malicious software is already running on the machine and aims to protect sensitive files such as SSH keys and browser / electron cookies. The presets are provided for common apps.

## Installing Santa

```sh
brew install santa  # requires root password
```

After installing:

1. Go to **Settings > General > Login Items & Extensions > Endpoint Security Extensions** and allow Santa.app's security extension and app background activity.
2. Go to **Settings > Privacy & Security > Full Disk Access** and allow 'Santa Extension Security Extension'.

Verify the installation:

```sh
/usr/local/bin/santactl status
sudo santactl doctor
```

## Santagift Usage

```bash
mkdir my-santa-config && cd my-santa-config
pnpm init
pnpm add santagift
```

Create a `santa.config.ts`:

```ts
import { ClientMode, defineConfig } from "santagift";

export default defineConfig(
  {
    outFile: "santa.mobileconfig",
  },
  {
    ClientMode: ClientMode.Lockdown,
    EnableSilentMode: false,
    UnknownBlockMessage: "This software is not allowed on this machine.",
    StaticRules: [
      {
        RuleType: "TEAMID",
        Policy: "ALLOWLIST",
        Identifier: "EQHXZ8M8AV",
        Comment: "Allow Apple software",
      },
    ],
  },
);
```


Generate the config:

```bash
pnpm santagift
```

This writes `santa.mobileconfig` to the current directory. To apply it:

1. Double-click `santa.mobileconfig`.
2. Go to **Settings > Privacy Downloaded > Device Management** and install the profile.

```bash
pnpm santagift --config path/to/other.config.ts   # use a custom config file
```

## API

### `defineConfig(generationOptions, santaConfig)`

The primary helper for defining a typed Santa configuration.

- **`generationOptions`** — santagift tool-specific options, e.g. the output file path.
- **`santaConfig`** — the Santa configuration payload. Use the same `PascalCase` key names Santa writes into plist.

For a full reference of available configuration keys and what they do, see:
- [Santa Config Docs](https://northpole.dev/configuration/keys/)
- [Santa Config File-Access Authorization Docs](https://northpole.dev/configuration/faa/)

### Other Data Types

For plist `<data>` values such as `ServerAuthRootsData`, use `PlistData`:

```ts
import { PlistData } from "santagift";

const certs = PlistData.fromBytes(
  new TextEncoder().encode("-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n"),
);

const sameCerts = PlistData.fromBase64("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCg==");
```

There is also `PlistReal` for non-integers that writes `<real>` in plist.

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
pnpm check     # Run type check
```


## Credits
This project incorporates code and documentation from Santa (https://github.com/northpolesec/santa),
used under the Apache License, Version 2.0.
