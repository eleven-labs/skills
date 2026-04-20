# Example 05: Advanced Patterns

Infinite query:

```ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { listItemsInfiniteOptions } from '@/lib/api/generated/@tanstack/react-query.gen';

export function useItemsInfiniteQuery() {
  return useInfiniteQuery(
    listItemsInfiniteOptions({
      query: { limit: 10 },
    }),
  );
}
```

Typed error handling:

```ts
import type { GetPostByIdError } from '@/lib/api/generated/types.gen';

const { data, error } = useQuery(getPostByIdOptions({ path: { id } }));

if (error) {
  const apiError = error as GetPostByIdError;
  // apiError.status, apiError.message
}
```

Optimistic update with rollback:

```ts
useMutation({
  ...updateItemMutation(),
  onMutate: async (variables) => {
    await queryClient.cancelQueries({
      queryKey: getItemQueryKey({ path: { id: variables.path.id } }),
    });

    const previous = queryClient.getQueryData(getItemQueryKey({ path: { id: variables.path.id } }));

    queryClient.setQueryData(getItemQueryKey({ path: { id: variables.path.id } }), (old) => ({
      ...old,
      ...variables.body,
    }));

    return { previous };
  },
  onError: (_error, variables, context) => {
    if (context?.previous) {
      queryClient.setQueryData(getItemQueryKey({ path: { id: variables.path.id } }), context.previous);
    }
  },
  onSettled: (_data, _error, variables) => {
    queryClient.invalidateQueries({
      queryKey: getItemQueryKey({ path: { id: variables.path.id } }),
    });
  },
});
```
