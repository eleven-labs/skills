# Batch Processing Pattern

```php
$batchSize = 200;
$i = 0;

$query = $entityManager->createQuery('SELECT u FROM App\\Entity\\User u');

foreach ($query->toIterable() as $user) {
    $user->setProcessedAt(new \\DateTimeImmutable());

    if (($i % $batchSize) === 0) {
        $entityManager->flush();
        $entityManager->clear();
    }

    $i++;
}

$entityManager->flush();
$entityManager->clear();
```
