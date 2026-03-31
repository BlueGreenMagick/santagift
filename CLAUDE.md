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
```

## Tools & Commands

**Toolchain:** mise, pnpm, biome (formatter & linter), tsdown (build), vitest (tests)

```bash
pnpm build       # Build with tsdown (outputs to dist/)
pnpm format      # Format code with biome
pnpm lint        # Lint with biome
pnpm lint:fix    # Fix lints and formatting
pnpm check       # Run type check
```
