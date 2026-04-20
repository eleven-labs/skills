## Evaluation 1: Enforces schema conventions and inferred types

**Input:**
"Create a Drizzle schema for `posts` with id, title, content, and timestamps."

**Expected Behavior:**

1. Uses `pgTable` with explicit snake_case column names.
2. Uses UUID primary key with `defaultRandom()`.
3. Exposes inferred types via `$inferSelect` and `$inferInsert` instead of duplicate DTO definitions.

**Success Criteria:**

- ✅ Schema uses `uuid(...).primaryKey().defaultRandom()`.
- ✅ Includes both `createdAt` and `updatedAt`.
- ✅ Defines types from Drizzle inference only.

**Category:** Schema conventions

## Evaluation 2: Uses RQBv2 relation definitions correctly

**Input:**
"Migrate this old Drizzle relations setup that uses `relations()` and `fields/references` to v1 beta style."

**Expected Behavior:**

1. Replaces `relations()` with `defineRelations()`.
2. Uses `from/to` mapping for relation fields.
3. Keeps relation mapping centralized and consistent with schema exports.

**Success Criteria:**

- ✅ Uses `defineRelations(...)`.
- ✅ Uses `from` and `to` in relation definitions.
- ✅ Avoids old `fields/references` API style.

**Category:** Relations migration

## Evaluation 3: Prefers relational query builder for nested reads

**Input:**
"Fetch users with their latest 5 published posts and nested comments."

**Expected Behavior:**

1. Uses `database.query.<table>.findMany(...)` with nested `with`.
2. Applies relation-level filter for published posts and a relation-level limit.
3. Avoids unnecessary manual join-heavy SQL for this read pattern.

**Success Criteria:**

- ✅ Uses RQB-style nested `with`.
- ✅ Includes a `where` condition on relation data and `limit: 5`.
- ✅ Does not default to raw SQL for this case.

**Category:** Query patterns

## Evaluation 4: Uses transactions for multi-table writes

**Input:**
"Create a post and then create an audit record linked to that post in one operation."

**Expected Behavior:**

1. Wraps all dependent writes in `database.transaction(...)`.
2. Uses the inserted post id from the first statement in the second statement.
3. Keeps write flow atomic.

**Success Criteria:**

- ✅ Uses `database.transaction(async (tx) => { ... })`.
- ✅ Executes both inserts through `tx`.
- ✅ The second write depends on data produced by the first write.

**Category:** Transaction safety

## Evaluation 5: Preserves migration hygiene and generated artifacts

**Input:**
"I changed the schema. What is the correct migration workflow and what should I avoid editing manually?"

**Expected Behavior:**

1. Recommends generating and applying migrations with Drizzle kit commands.
2. States that generated migrations should not be manually edited.
3. Mentions current migration structure expectations in the skill (`snapshot.json` and `migration.sql`).

**Success Criteria:**

- ✅ Includes `drizzle-kit generate` and `drizzle-kit migrate` (or equivalent workflow in the skill).
- ✅ Explicitly warns against editing generated migration files.
- ✅ References expected generated migration artifacts.

**Category:** Migration workflow
