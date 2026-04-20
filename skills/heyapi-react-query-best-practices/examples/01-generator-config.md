# Example 01: Generator Configuration

`openapi-ts.config.mjs`

```js
/** @type {import('@hey-api/openapi-ts').UserConfig} */
export default {
  client: '@hey-api/client-fetch',
  input: './openapi/openapi.json',
  output: './src/lib/api/generated',
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-next',
      runtimeConfigPath: '@/lib/api/client',
    },
    {
      name: '@tanstack/react-query',
      mutationOptions: true,
      queryKeys: true,
      queryOptions: true,
    },
  ],
};
```

For non-Next.js apps, replace `@hey-api/client-next` with `@hey-api/client-fetch` plugin or omit that plugin block.

`package.json`

```json
{
  "scripts": {
    "api:generate": "openapi-ts -f openapi-ts.config.mjs"
  }
}
```

```bash
npm run api:generate
```
