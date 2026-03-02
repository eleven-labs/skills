# Doctrine Performance Checklist

- Profile query count and execution time before changes.
- Check for N+1 query patterns on associations.
- Replace entity loading for counts/existence checks with DB aggregates.
- Use `toIterable()` for large result processing.
- Flush and clear in batches for long-running workers.
- Add indexes matching `WHERE` and `ORDER BY` patterns.
- Validate index impact on write-heavy operations.
- Prefer set-based updates for large bulk mutations.
