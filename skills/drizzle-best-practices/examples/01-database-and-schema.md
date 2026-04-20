# Example 01: Database Setup and Schema

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (relationBuilder) => ({
  users: {
    posts: relationBuilder.many.posts(),
  },
  posts: {
    author: relationBuilder.one.users({
      from: relationBuilder.posts.authorId,
      to: relationBuilder.users.id,
    }),
  },
}));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export const database = drizzle(databaseUrl, {
  casing: 'snake_case',
  schema,
  relations,
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```
