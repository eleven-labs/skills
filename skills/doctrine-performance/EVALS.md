## Evaluation 1: Detects and fixes N+1 query pattern

**Input:**
"My Doctrine endpoint is slow. I load posts with `findAll()` and inside a loop I call `$post->getAuthor()->getName()`."

**Expected Behavior:**

1. Identifies the N+1 pattern explicitly.
2. Recommends a join-based query with `leftJoin`/`addSelect` (or equivalent) to load related authors in one query.
3. Explains expected impact on query count and latency.

**Success Criteria:**

- ✅ Mentions "N+1" explicitly.
- ✅ Provides a concrete Doctrine query fix using a join.
- ✅ States why this improves performance.

**Category:** Query optimization

## Evaluation 2: Proposes memory-safe batch processing

**Input:**
"I need to process 2 million users with Doctrine, but the worker runs out of memory."

**Expected Behavior:**

1. Recommends iterating with `toIterable()` (or equivalent streaming pattern).
2. Uses controlled batch size with periodic `flush()` and `clear()`.
3. Avoids per-entity flush.

**Success Criteria:**

- ✅ Includes batch size strategy.
- ✅ Uses `flush()` + `clear()` in loop checkpoints.
- ✅ Avoids flushing every iteration.

**Category:** Memory management

## Evaluation 3: Replaces inefficient counting

**Input:**
"In my repository I do `count($repository->findAll())` to get total active users."

**Expected Behavior:**

1. Flags loading all entities as inefficient.
2. Replaces with aggregate count query (`COUNT(...)`) in DQL/QueryBuilder.
3. Preserves active filter semantics.

**Success Criteria:**

- ✅ Rejects `findAll()` + `count()` approach.
- ✅ Proposes DB-side `COUNT` query.
- ✅ Keeps `active` filter in query.

**Category:** DQL optimization

## Evaluation 4: Recommends indexing for query shape

**Input:**
"This query is slow: `WHERE status = :status AND priority = :priority ORDER BY createdAt DESC`."

**Expected Behavior:**

1. Suggests a composite index aligned to filter and sort pattern.
2. Avoids generic advice only; maps index fields to the provided query.
3. Mentions read/write tradeoff of indexing.

**Success Criteria:**

- ✅ Suggests composite index including `status`, `priority`, and `createdAt`.
- ✅ Ties recommendation to the specific query pattern.
- ✅ Mentions index tradeoff.

**Category:** Index optimization

## Evaluation 5: Chooses native SQL for bulk update

**Input:**
"We must deactivate 8 million rows once per night. Current implementation updates each entity in a Doctrine loop."

**Expected Behavior:**

1. Recommends set-based bulk update (DQL bulk update or native SQL) instead of entity-by-entity loop.
2. Mentions Unit of Work overhead with per-entity processing.
3. Advises clearing/refreshing managed entities after bulk operation.

**Success Criteria:**

- ✅ Recommends bulk operation strategy.
- ✅ Explains why loop-based entity updates are expensive.
- ✅ Includes entity manager synchronization advice after update.

**Category:** Bulk operations
