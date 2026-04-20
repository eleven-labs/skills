# Example 03: CRUD, Transactions, and Seeds

```ts
import { eq } from 'drizzle-orm';
import { posts, auditLogs } from '../schema';

// Select
await database.select().from(posts);

// Insert
const [createdPost] = await database.insert(posts).values({ title, content }).returning();

// Update
const [updatedPost] = await database
  .update(posts)
  .set({ title, updatedAt: new Date() })
  .where(eq(posts.id, id))
  .returning();

// Delete
await database.delete(posts).where(eq(posts.id, id));

// Transaction for dependent writes
await database.transaction(async (transaction) => {
  const [post] = await transaction.insert(posts).values({ title, content }).returning();

  await transaction.insert(auditLogs).values({
    entity: 'post',
    entityId: post.id,
    action: 'created',
  });
});

// Idempotent seed
export async function seedPosts(database: DrizzleDatabase) {
  await database.delete(posts);
  await database.insert(posts).values([
    { title: 'Hello', content: 'World', isPublished: true },
    { title: 'Draft', content: 'In progress', isPublished: false },
  ]);
}
```
