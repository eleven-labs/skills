# Example 02: Query Client and Provider

`src/core/query/query-client.ts`

```ts
import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}
```

`src/core/query/query-provider.tsx`

```tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/core/query/query-client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

Root wiring:

```tsx
<QueryProvider>{children}</QueryProvider>
```
