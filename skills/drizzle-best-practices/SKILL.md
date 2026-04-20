---
name: drizzle-best-practices
description: Create and maintain Drizzle ORM schemas, relations, and migrations for PostgreSQL. Use when implementing or reviewing Drizzle database layers to keep conventions, type safety, and migration hygiene.
---

# Drizzle ORM v1 Beta Best Practices (PostgreSQL)

> Focus: Scalable architecture + Drizzle v1 beta (RQBv2, migrations v3)

---

## Stack

- `drizzle-orm@1.0.0-beta.x`
- `drizzle-kit@beta`
- PostgreSQL
- Driver: `postgres` (recommended) or `pg`

---

## Installation

```bash
npm i drizzle-orm@beta
npm i drizzle-kit@beta -D
npm i postgres
```

---

## Database Setup

Use a single database factory with centralized `schema` and `relations`.

See implementation example:
- `examples/01-database-and-schema.md`

---

## Project Structure

```
src/core/database/
  schema/
    user.schema.ts
    post.schema.ts
    index.ts
  relations/
    index.ts
  seeds/
drizzle/
```

### Rules

- One file per table
- Centralized exports (`schema/index.ts`)
- Never edit generated migrations

---

## Schema (PostgreSQL + Beta)
See complete schema example:
- `examples/01-database-and-schema.md`

### Best Practices

- Use UUID primary keys (`defaultRandom`)
- Always include `createdAt` and `updatedAt`
- Infer types from schema only
- No duplicated DTO types

---

## Relations — RQBv2 (Breaking Change)
See complete relations example:
- `examples/02-relations-and-queries.md`

### Migration from v1

| Old                 | New                 |
| ------------------- | ------------------- |
| `relations()`       | `defineRelations()` |
| `fields/references` | `from/to`           |
| schema spread       | `relations` option  |

---

## CRUD Operations
See CRUD example:
- `examples/03-crud-transactions-and-seeds.md`

---

## Relational Queries (RQBv2)

> ⚠️ Preferred approach: Use RQBv2 for most read operations. It provides better type-safety, composability, and maintainability for real-world queries.
See RQBv2 query examples:
- `examples/02-relations-and-queries.md`

### Key Points

- Type-safe nested queries
- No manual join tables for many-to-many
- Preferred over complex joins

---

## Transactions
See transaction example:
- `examples/03-crud-transactions-and-seeds.md`

---

## Migrations (v3 Structure — Breaking Change)
See migration workflow:
- `examples/04-migrations-and-indexes.md`

### Structure

```
drizzle/
  0001_migration/
    snapshot.json
    migration.sql
```

### Changes

- `journal.json` removed
- Isolated migrations
- Better Git conflict handling

---

## Seeds
See seed example:
- `examples/03-crud-transactions-and-seeds.md`

- Idempotent
- Safe to re-run

---

## Constraints & Indexes
See constraints and indexes example:
- `examples/04-migrations-and-indexes.md`

---

## Best Practices

- Always use `.returning()`
- Prefer RQBv2 over joins
- Avoid raw SQL when possible
- Use transactions for multi-table operations
- Update `updatedAt` manually
- Use explicit naming (no abbreviations)

---

## Critical Breaking Changes (Beta)

- `defineRelations` replaces `relations`
- `pgTable.withRLS()` replaces `.enableRLS()`
- New migrations structure (v3)
- Validation moved to `drizzle-orm/zod`
- RQBv2 becomes the standard
