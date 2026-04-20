---
name: heyapi-react-query-best-practices
description: Generate and maintain type-safe API clients and React Query integrations with @hey-api/openapi-ts and TanStack React Query v5. Use when implementing OpenAPI-driven data layers to standardize generated hooks, cache keys, mutations, hydration, and client configuration.
---

# @hey-api + TanStack React Query v5 Best Practices

> Stack: `@hey-api/openapi-ts` + `@hey-api/client-fetch` + `@tanstack/react-query@5`

---

## Installation

```bash
npm i @hey-api/client-fetch @tanstack/react-query
npm i @hey-api/openapi-ts -D
```

---

## Configuration and Generation

Set up the generator with:
- `@hey-api/client-fetch` runtime client
- `@tanstack/react-query` plugin (`queryKeys`, `queryOptions`, `mutationOptions`)
- an `api:generate` script in `package.json`

Run generation after every API contract change:

```bash
npm run api:generate
```

See complete setup example:
- `examples/01-generator-config.md`

---

## Generated File Map

```
src/lib/api/generated/
  types.gen.ts              ← request/response types (never edit)
  sdk.gen.ts                ← raw fetch functions (never edit)
  client.gen.ts             ← configured client instance (never edit)
  @tanstack/
    react-query.gen.ts      ← queryOptions / mutationOptions / queryKeys (never edit)
```

> **Never edit generated files.** All customisation goes in `src/lib/api/client.ts`.

---

## Query Client and Provider

Use one `QueryClient` per component lifecycle:
- create a central `createQueryClient()`
- use `useState(createQueryClient)` in provider
- wrap the root app entry with `QueryClientProvider`

See full example:
- `examples/02-query-client-provider.md`

---

## Query and Mutation Hooks

Use generated helpers as the single source of truth:
- `useQuery(generatedOptions(...))`
- `useMutation({ ...generatedMutation(), onSuccess })`
- invalidate with generated `*QueryKey()` only

See full hook examples:
- `examples/03-hooks-and-mutations.md`

---

## SSR Hydration (Next.js App Router)

For server prefetch:
- create server `QueryClient`
- `prefetchQuery(generatedOptions(...))`
- return `HydrationBoundary` with `dehydrate(queryClient)`

See complete SSR + client example:
- `examples/04-ssr-hydration.md`

---

## Advanced Patterns

Use advanced patterns only where needed:
- infinite queries with generated infinite options
- typed error handling from generated error types
- optimistic updates with rollback via `onMutate`/`onError`/`onSettled`

See advanced examples:
- `examples/05-advanced-patterns.md`

---

## Project Structure

```
src/
  lib/api/
    client.ts               ← baseUrl config (edit this)
    generated/              ← never edit
  core/query/
    query-client.ts
    query-provider.tsx
  features/<name>/
    hooks/
      use-<operation>-query.ts
      use-<operation>-mutation.ts
openapi-ts.config.mjs
openapi/
  openapi.json              ← source of truth for API contract
```

---

## Rules

- Never import from `generated/sdk.gen.ts` directly in components — use the generated `*Options`/`*Mutation` helpers.
- Never edit any `*.gen.ts` file.
- Always wrap generated options in a custom hook (`use-*-query.ts`).
- Keep one hook per operation, in `features/<name>/hooks/`.
- Use `queryKeys` exports for all `invalidateQueries` calls — no hardcoded strings.
- Add `throwOnError: true` only if the default config omits it (the generated client sets it).
- `useState(createQueryClient)` pattern prevents re-creating `QueryClient` on re-renders.
