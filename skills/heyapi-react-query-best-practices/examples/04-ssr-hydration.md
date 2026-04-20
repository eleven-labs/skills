# Example 04: Server Prefetch and Hydration

`app/items/page.tsx`

```tsx
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { listItemsOptions } from '@/lib/api/generated/@tanstack/react-query.gen';
import ItemsClient from './client';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(listItemsOptions({ query: { page: 1 } }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsClient />
    </HydrationBoundary>
  );
}
```

`app/items/client.tsx`

```tsx
'use client';

import { useItemsQuery } from '@/features/items/hooks/use-items-query';

export default function ItemsClient() {
  const { data, isPending, isError } = useItemsQuery();

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <ul>
      {data?.items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```
