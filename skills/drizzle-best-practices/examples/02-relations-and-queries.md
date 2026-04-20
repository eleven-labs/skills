# Example 02: RQBv2 Relations and Nested Queries

```ts
import { defineRelations, eq } from 'drizzle-orm';
import * as schema from '../schema';

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

await database.query.users.findMany({
  with: { posts: true },
});

await database.query.users.findMany({
  with: {
    posts: {
      with: {
        comments: true,
      },
    },
  },
});

await database.query.users.findMany({
  with: {
    posts: {
      where: eq(schema.posts.isPublished, true),
      limit: 5,
    },
  },
});
```

Migration note:
- Old `relations()` becomes `defineRelations()`.
- Old `fields/references` becomes `from/to`.
