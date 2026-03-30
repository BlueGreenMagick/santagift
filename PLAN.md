# Task Description

## Problem Statement
Managing macOS Santa security tool configuration via raw `.mobileconfig` XML (Apple plist) is error-prone and hard to maintain. There is no type-safe, developer-friendly way to generate these files. This package provides a TypeScript-first config DSL that compiles down to the correct `.mobileconfig` XML.

## Current Implementation
This is a greenfield project. The repo has scaffolding only: `package.json` (ESM, pnpm), `biome.json` (linting/formatting), and `typescript` + `@biomejs/biome` as dev dependencies. No source files exist yet.

## Solution Overview
Users install `santagift` and write a `santa.config.ts` using the exported `defineConfig` helper. Running `santaconfig` (or `pnpm santaconfig`) reads that file and writes a `.mobileconfig` Apple plist XML file.

Example: `santaconfig --config santa.config.ts` → writes `santa.mobileconfig`

## Scope
### Included
- `defineConfig()` helper with typed config schema (partial Santa keys for now)
- CLI binary `santaconfig` that accepts `--config <file>` (defaults to `santa.config.ts`)
- TypeScript config file loading via `jiti` (executes TS without a separate build step)
- Plist XML generation: outer MDM payload envelope + Santa `PayloadContent` dict
- `FileAccessPolicy` dict generation from the config's `fileAccessPolicy` array
- `clientMode` string enum mapped to integer (`monitor` → 1, `lockdown` → 2)
- UUID auto-generation for all `PayloadUUID` / `PayloadIdentifier` fields
- Built with `tsdown`; exports both CJS and ESM

### Excluded
- Full Santa config key coverage (deferred)
- Config file validation / schema errors (deferred)
- Watch mode / incremental regeneration
- Publishing to npm registry

---

# Implementation Details

## Type Signatures

```ts
// --- defineConfig inputs ---

// First param: tooling options, not written to plist
interface GenerationOptions {
  outFile?: string       // default: "santa.mobileconfig"
}

// Second param: the actual Santa MDM payload config (main config keys + policy, all flat)
interface SantaConfig {
  clientMode?: "monitor" | "lockdown"   // maps to integer 1 / 2
  failClosed?: boolean
  // additional Santa keys added later
  fileAccessPolicy?: Record<string, FileAccessPolicyEntry>  // key becomes the plist dict key
}

interface FileAccessPolicyEntry {
  paths: PathEntry[]
  options: PolicyOptions
  processes?: ProcessEntry[]
}

interface PathEntry {
  path: string
  isPrefix?: boolean   // default: false
}

interface PolicyOptions {
  allowReadAccess?: boolean
  auditOnly?: boolean
  ruleType?: "PathsWithAllowedProcesses" | "AllPaths"
}

interface ProcessEntry {
  signingId?: string
  teamId?: string
  platformBinary?: boolean
}

// What defineConfig returns (passed to the generator)
interface SantaGiftConfig {
  generationOptions: GenerationOptions
  santaConfig: SantaConfig
}

function defineConfig(generationOptions: GenerationOptions, santaConfig: SantaConfig): SantaGiftConfig
```

## Implementation Strategy

**Package structure:**
- `src/index.ts` — exports `defineConfig` and all types (the library entry point)
- `src/cli.ts` — CLI binary; parses args, loads config, calls generator, writes output
- `src/generator.ts` — pure function `generatePlist(config: SantaGiftConfig): string`
- `src/plist.ts` — low-level plist XML builder helpers (no external XML library needed)

**Config file loading (CLI):**
Use `jiti` to dynamically import the user's `santa.config.ts`. `jiti` transparently transpiles TypeScript on the fly. The loaded module's `default` export is the `SantaGiftConfig` returned by `defineConfig`. Config path defaults to `./santa.config.ts`, overridable via `--config <path>`.

**Plist generation (`generator.ts`):**
1. Generate two UUIDs: one for the outer envelope, one for the Santa payload.
2. Build the outer MDM envelope dict (fixed fields: `PayloadDisplayName`, `PayloadEnabled`, `PayloadType`, `PayloadScope`, `PayloadUUID`, `PayloadIdentifier`).
3. Build the Santa payload dict inside `PayloadContent`:
   - `ClientMode` integer (monitor→1, lockdown→2)
   - `FailClosed` boolean
   - `FileAccessPolicy` dict: iterate `Record<string, FileAccessPolicyEntry>`, emit each entry as a named sub-dict with `Paths`, `Options`, and optionally `Processes`
   - Fixed payload metadata: `PayloadDisplayName: "Santa"`, `PayloadType: "com.northpolesec.santa"`, `PayloadVersion: 1`, plus generated UUID/identifier

**Plist XML builder (`plist.ts`):**
Simple recursive string builder with indentation. Helpers: `plistString`, `plistInteger`, `plistBool`, `plistArray`, `plistDict`, `plistKey`. No external XML library. The root template wraps everything in the standard `<?xml ...>` + `<!DOCTYPE ...>` + `<plist version="1.0">` header.

**tsdown config (`tsdown.config.ts`):**
- Entry points: `src/index.ts` (library) + `src/cli.ts` (binary)
- Output: `dist/`
- Format: ESM (primary) + CJS
- `package.json` `bin` field: `{ "santaconfig": "./dist/cli.js" }`

**Dependencies to add:**
- `jiti` (runtime dep) — TS config file loading
- `tsdown` (dev dep) — build tool

## Assumptions & Edge Cases
- UUIDs are generated fresh on every run; the output is not deterministic. This is fine for MDM deployment (profiles are identified by `PayloadIdentifier`, not UUID).
- `isPrefix` defaults to `false` if omitted (matching plist omission behavior).
- If `fileAccessPolicy` is empty or omitted, the `FileAccessPolicy` key is not emitted.
- If `config` fields are omitted, only the fields present are emitted (no defaults injected into the plist).
- The CLI resolves the config file path relative to `process.cwd()`.
- `outFile` in `GenerationOptions` is relative to `process.cwd()`.

# Action Plan

## Step 1: N/A
N/A
