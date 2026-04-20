# Example 03: Query and Mutation Hooks

`use-items-query.ts`

```ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listItemsOptions } from '@/lib/api/generated/@tanstack/react-query.gen';

export function useItemsQuery(params?: { page?: number }) {
  return useQuery(
    listItemsOptions({
      query: {
        page: params?.page,
      },
    }),
  );
}
```

`use-create-item-mutation.ts`

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createItemMutation,
  listItemsQueryKey,
} from '@/lib/api/generated/@tanstack/react-query.gen';

export function useCreateItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...createItemMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listItemsQueryKey() });
    },
  });
}
```
