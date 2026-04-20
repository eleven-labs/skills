# Example 04: Migrations, Constraints, and Indexes

Migration workflow:

```bash
drizzle-kit generate
drizzle-kit migrate
drizzle-kit up
```

Expected generated structure:

```text
drizzle/
  0001_migration/
    snapshot.json
    migration.sql
```

Constraint and index sample:

```ts
import { pgTable, text, integer, unique, index, check, sql } from 'drizzle-orm/pg-core';

export const products = pgTable(
  'products',
  {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    price: integer('price').notNull(),
  },
  (table) => ({
    emailUnique: unique().on(table.email),
    nameIndex: index('products_name_index').on(table.name),
    positivePrice: check('products_price_check', sql`${table.price} > 0`),
  }),
);
```

Rules:
- Do not edit generated migration SQL manually unless there is a documented exception.
- Commit both `snapshot.json` and `migration.sql`.
