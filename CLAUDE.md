## Instructions
- Before working on a task, read README.md to understand the project.

## Project Structure

```
src/
  index.ts      # Public API — exports types and defineConfig()
  types.ts      # All TypeScript types for SantaConfig, rules, policies, etc.
  generator.ts  # Plist generation logic
  plist.ts      # Plist serialization utilities
  cli.ts        # CLI entrypoint (santaconfig binary)
  presets/
    index.ts          # Assembles and exports filePresets, fileConfigs, electronV8Heap
    file/             # One file per FAA preset (ssh, chrome-cookies, etc.)
      lib/
        electron.ts   # electronV8Heap(appPath, teamId) factory
```

The `santagift/presets` subpath exports:
- `filePresets` — individual `Record<string, FileAccessPolicyEntry>` objects, spread into `FileAccessPolicy.WatchItems` array. 
- `fileConfigs`: group of presets. e.g. `fileConfigs.recommended`

## Tools & Commands

**Toolchain:** mise, pnpm, biome (formatter & linter), tsdown (build), vitest (tests)

```bash
pnpm build       # Build with tsdown (outputs to dist/)
pnpm format      # Format code with biome
pnpm lint        # Lint with biome
pnpm lint:fix    # Fix lints and formatting
pnpm check       # Run type check
```
