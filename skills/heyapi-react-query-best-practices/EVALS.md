## Evaluation 1: Generates consistent openapi-ts config

**Input:**
"Set up `openapi-ts.config.mjs` for a React app using Hey API and React Query."

**Expected Behavior:**

1. Uses `@hey-api/client-fetch` as the client runtime.
2. Configures `@tanstack/react-query` plugin with query keys and query options enabled.
3. Includes a generation script in `package.json`.

**Success Criteria:**

- ✅ Config includes `client: '@hey-api/client-fetch'`.
- ✅ React Query plugin enables `queryKeys` and `queryOptions`.
- ✅ Response includes `api:generate` script using `openapi-ts`.

**Category:** Generator configuration

## Evaluation 2: Enforces generated-files boundary

**Input:**
"I need to tweak behavior in generated `react-query.gen.ts`. Where should I customize?"

**Expected Behavior:**

1. Refuses direct edits in generated files.
2. Redirects customization to `src/lib/api/client.ts` (or equivalent runtime config layer).
3. Explains regeneration workflow after contract changes.

**Success Criteria:**

- ✅ Explicitly says generated files should not be edited manually.
- ✅ Points to runtime/client customization file.
- ✅ Mentions rerunning generation after API contract changes.

**Category:** Code ownership boundaries

## Evaluation 3: Uses query option helpers in hooks

**Input:**
"Create a `useItemsQuery` hook from generated Hey API React Query helpers."

**Expected Behavior:**

1. Uses `useQuery(...)` with generated `*Options(...)` helper.
2. Keeps query params inside the generated options shape.
3. Avoids custom ad-hoc query keys when generated keys/helpers exist.

**Success Criteria:**

- ✅ Hook calls `useQuery(generatedOptions(...))`.
- ✅ Input params are wired through options payload.
- ✅ Does not manually craft query key arrays for the same endpoint.

**Category:** Query hooks

## Evaluation 4: Implements mutation invalidation with generated keys

**Input:**
"Implement create-item mutation and refresh item list cache on success."

**Expected Behavior:**

1. Uses generated mutation helper (`*Mutation`).
2. Uses `useQueryClient()` and invalidates relevant cache with generated `*QueryKey`.
3. Keeps invalidation in `onSuccess`.

**Success Criteria:**

- ✅ Uses `useMutation({ ...generatedMutation(), onSuccess })`.
- ✅ Calls `queryClient.invalidateQueries({ queryKey: generatedQueryKey() })`.
- ✅ Invalidation occurs after successful mutation.

**Category:** Mutation patterns

## Evaluation 5: Applies SSR prefetch hydration pattern

**Input:**
"Show Next.js App Router prefetch with React Query hydration for generated list options."

**Expected Behavior:**

1. Creates a server-side `QueryClient`.
2. Prefetches with generated options helper.
3. Wraps client component with `HydrationBoundary` using `dehydrate(queryClient)`.

**Success Criteria:**

- ✅ Uses `prefetchQuery(generatedOptions(...))` on the server.
- ✅ Uses `dehydrate(queryClient)` and `HydrationBoundary`.
- ✅ Client component consumes hydrated query hook.

**Category:** SSR hydration
