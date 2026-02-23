---
name: doctrine-performance
description: Doctrine ORM performance guidance, covering query optimization, memory management and database interaction patterns
---

## What I do

- Optimizing slow database queries
- Reducing memory consumption in batch operations
- Debugging N+1 query problems
- Handling large datasets efficiently
- Improving application response times
- Migrating complex database schemas

## When to Use This Skill

When having to implement complex Doctrine queries or heavy memory consumption operations and loops.
When user asks for optimizing code or a feature depending on Doctrine queries.
Ask clarifying questions to ensure refactoring match expected result.

## Core Principles

### 1. Query Optimization Fundamentals

**Always Use Query Builder or DQL for Complex Queries**
```php
// ❌ Bad - Entity loading overhead
$users = $entityManager->getRepository(User::class)->findAll();
foreach ($users as $user) {
    echo $user->getEmail();
}

// ✅ Good - Selective field loading
$emails = $entityManager->createQueryBuilder()
    ->select('u.email')
    ->from(User::class, 'u')
    ->getQuery()
    ->getResult();
```

**Avoid N+1 Queries with Proper Joins**
```php
// ❌ Bad - N+1 problem
$posts = $entityManager->getRepository(Post::class)->findAll();
foreach ($posts as $post) {
    echo $post->getAuthor()->getName(); // Triggers separate query per post
}

// ✅ Good - Eager loading with join
$posts = $entityManager->createQueryBuilder()
    ->select('p', 'a')
    ->from(Post::class, 'p')
    ->leftJoin('p.author', 'a')
    ->getQuery()
    ->getResult();
```

**Use Partial Objects for Large Datasets**
```php
// ✅ Load only needed fields
$result = $entityManager->createQueryBuilder()
    ->select('partial u.{id, email, username}')
    ->from(User::class, 'u')
    ->where('u.active = :active')
    ->setParameter('active', true)
    ->getQuery()
    ->getResult();
```

### 2. Memory Management

**Batch Processing Pattern**
```php
// ✅ Efficient batch processing with memory management
$batchSize = 100;
$i = 0;
$query = $entityManager->createQuery('SELECT u FROM App\Entity\User u');

foreach ($query->toIterable() as $user) {
    $user->setProcessed(true);
    
    if (($i % $batchSize) === 0) {
        $entityManager->flush();
        $entityManager->clear(); // Detach objects from memory
    }
    
    $i++;
}

$entityManager->flush(); // Flush remaining entities
$entityManager->clear();
```

**Use Iterate for Large Result Sets**
```php
// ✅ Memory-efficient iteration
$query = $entityManager->createQuery('SELECT u FROM App\Entity\User u');
$iterableResult = $query->toIterable();

foreach ($iterableResult as $row) {
    $user = $row[0]; // Access the entity
    // Process user
    $entityManager->detach($user); // Free memory immediately
}
```

### 3. Index Optimization

**Add Indexes for Frequently Queried Fields**
```php
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Index(name: 'idx_user_email', columns: ['email'])]
#[ORM\Index(name: 'idx_user_active_created', columns: ['active', 'created_at'])]
class User
{
    #[ORM\Column(type: 'string', unique: true)]
    private string $email;
    
    #[ORM\Column(type: 'boolean')]
    private bool $active;
    
    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdAt;
}
```

**Composite Indexes for Multi-Column Queries**
```php
// ✅ Good - Composite index for common query pattern
#[ORM\Index(name: 'idx_status_priority_created', columns: ['status', 'priority', 'created_at'])]
class Task
{
    // Supports queries like:
    // WHERE status = ? AND priority = ? ORDER BY created_at
}
```

### 4. Caching Strategies

**Result Cache Configuration**
```php
// Cache query results
$query = $entityManager->createQuery('SELECT u FROM App\Entity\User u WHERE u.role = :role')
    ->setParameter('role', 'admin')
    ->useResultCache(true, 3600, 'admin_users_cache');

$results = $query->getResult();
```

### 5. DQL Optimization Patterns

**Efficient Counting**
```php
// ❌ Bad - Loads all entities
$count = count($repository->findAll());

// ✅ Good - Count in database
$count = $entityManager->createQueryBuilder()
    ->select('COUNT(u.id)')
    ->from(User::class, 'u')
    ->getQuery()
    ->getSingleScalarResult();
```

**Efficient Existence Check**
```php
// ❌ Bad - Loads entity
$user = $repository->findOneBy(['email' => $email]);
$exists = $user !== null;

// ✅ Good - Check in database
$exists = $entityManager->createQueryBuilder()
    ->select('COUNT(u.id)')
    ->from(User::class, 'u')
    ->where('u.email = :email')
    ->setParameter('email', $email)
    ->getQuery()
    ->getSingleScalarResult() > 0;
```

**Subquery Optimization**
```php
// ✅ Efficient subquery with DQL
$qb = $entityManager->createQueryBuilder();
$subQuery = $qb->select('IDENTITY(o.user)')
    ->from(Order::class, 'o')
    ->where('o.total > :minTotal')
    ->getDQL();

$users = $entityManager->createQueryBuilder()
    ->select('u')
    ->from(User::class, 'u')
    ->where("u.id IN ($subQuery)")
    ->setParameter('minTotal', 1000)
    ->getQuery()
    ->getResult();
```

## Common Performance Pitfalls

### 1. Avoiding Unit of Work Overhead
```php
// ❌ Bad - Multiple flushes
foreach ($users as $user) {
    $user->setActive(true);
    $entityManager->flush(); // Very slow!
}

// ✅ Good - Single flush
foreach ($users as $user) {
    $user->setActive(true);
}
$entityManager->flush(); // Single transaction
```

### 2. Using Native SQL When Appropriate
```php
// For very complex queries or bulk operations, use native SQL
$sql = "
    UPDATE user 
    SET active = 1 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR)
";
$entityManager->getConnection()->executeStatement($sql);

// Remember to clear entity manager to avoid stale data
$entityManager->clear();
```

## Quick Reference

**Most Common Optimizations:**
1. Add indexes to frequently queried columns
2. Use joins to avoid N+1 queries
3. Use batch processing with `clear()` for large datasets
4. Choose appropriate hydration modes
5. Use partial object notation when loading specific fields
6. Implement query result caching for expensive queries
7. Use `EXTRA_LAZY` for large collections
8. Profile before optimizing

## Remember

- Premature optimization is evil - profile first!
- Database-level operations are almost always faster than PHP loops
- Memory usage matters more than you think in long-running processes
- The fastest query is the one you don't execute
- Indexes speed up reads but slow down writes - balance accordingly
