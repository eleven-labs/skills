# SDK Reference

## Table des matieres

- Connexion aux serveurs MCP
- Tester avec un LLM
- Evals statistiques
- Multi-providers
- Exemple complet

## Connexion aux serveurs MCP

### Serveur STDIO local

```typescript
import { MCPClientManager } from "@mcpjam/sdk";

const manager = new MCPClientManager({
  myServer: {
    command: "node",
    args: ["./my-server.js"],
    env: { API_KEY: process.env.MY_API_KEY },
  },
});

await manager.connectToServer("myServer");
const tools = await manager.listTools("myServer");
```

### Serveur HTTP/SSE distant

```typescript
const manager = new MCPClientManager({
  asana: {
    url: "https://mcp.asana.com/sse",
    requestInit: {
      headers: { Authorization: `Bearer ${process.env.ASANA_TOKEN}` },
    },
  },
});
```

### Multi-serveurs

```typescript
await Promise.all([
  manager.connectToServer("serverA"),
  manager.connectToServer("serverB"),
]);

const allTools = await manager.getTools();
```

### Exercice direct d'un outil

```typescript
const result = await manager.executeTool("myServer", "add", { a: 5, b: 3 });
```

### Nettoyage et health check

```typescript
await manager.disconnectServer("myServer");

const isHealthy = await manager.pingServer("myServer");
```

## Tester avec un LLM

```typescript
import { MCPClientManager, TestAgent } from "@mcpjam/sdk";

const agent = new TestAgent({
  tools: await manager.getTools(),
  model: "anthropic/claude-sonnet-4-20250514",
  apiKey: process.env.ANTHROPIC_API_KEY,
  systemPrompt: "You are a helpful assistant.",
  temperature: 0.1,
  maxSteps: 5,
});
```

### Inspecter le resultat

```typescript
const result = await agent.prompt("Add 15 and 27");

result.getText();
result.toolsCalled();
result.hasToolCall("add");
result.getToolArguments("add");
result.getToolCalls();
result.e2eLatencyMs();
result.llmLatencyMs();
result.mcpLatencyMs();
result.totalTokens();
result.hasError();
result.getError();
```

### Conversations multi-tours

```typescript
const r1 = await agent.prompt("Create a task 'Buy groceries'");
const r2 = await agent.prompt("Mark it high priority", { context: r1 });
const r3 = await agent.prompt("Show all tasks", { context: [r1, r2] });
```

### Helpers d'assertion

```typescript
import { matchToolCalls, matchToolCallWithArgs } from "@mcpjam/sdk";

expect(matchToolCalls(["add"], result.toolsCalled())).toBe(true);
expect(matchToolCallWithArgs("add", { a: 10, b: 5 }, result.getToolCalls())).toBe(true);
```

## Evals statistiques

### EvalTest

```typescript
import { EvalTest } from "@mcpjam/sdk";

const test = new EvalTest({
  name: "addition-accuracy",
  test: async (agent) => {
    const result = await agent.prompt("Add 2 and 3");
    return result.hasToolCall("add");
  },
});

await test.run(agent, {
  iterations: 30,
  concurrency: 5,
  retries: 2,
  timeoutMs: 30000,
  onProgress: (done, total) => console.log(`${done}/${total}`),
});

console.log(`Accuracy: ${(test.accuracy() * 100).toFixed(1)}%`);
```

### EvalSuite

```typescript
import { EvalSuite, EvalTest } from "@mcpjam/sdk";

const suite = new EvalSuite({ name: "Math Operations" });

suite.add(new EvalTest({
  name: "addition",
  test: async (a) => (await a.prompt("Add 5 and 3")).hasToolCall("add"),
}));

suite.add(new EvalTest({
  name: "division",
  test: async (a) => (await a.prompt("Divide 20 by 4")).hasToolCall("divide"),
}));

await suite.run(agent, { iterations: 30 });

console.log(`Suite: ${(suite.accuracy() * 100).toFixed(1)}%`);

for (const test of suite.getTests()) {
  console.log(`  ${test.name}: ${(test.accuracy() * 100).toFixed(1)}%`);
}
```

### Nombre d'iterations recommande

| Cas | Iterations |
|---|---|
| Smoke test rapide | 10 |
| Tests courants | 30 |
| Pre-release | 50-100 |
| Benchmarking | 100+ |

### Quality gate CI

```typescript
await suite.run(agent, { iterations: 30 });

if (suite.accuracy() < 0.9) {
  console.error(`Accuracy ${suite.accuracy()} below 90% threshold`);
  process.exit(1);
}
```

## Multi-providers

### Formats de modeles courants

| Provider | Format modele |
|---|---|
| Anthropic | `anthropic/claude-sonnet-4-20250514` |
| OpenAI | `openai/gpt-4o` |
| Google | `google/gemini-1.5-pro` |
| Mistral | `mistral/mistral-large-latest` |
| DeepSeek | `deepseek/deepseek-chat` |
| Ollama | `ollama/llama3` |
| OpenRouter | `openrouter/anthropic/claude-3-opus` |
| xAI | `xai/grok-beta` |
| Azure | `azure/gpt-4o` |

### Comparaison de providers

```typescript
const providers = [
  { model: "anthropic/claude-sonnet-4-20250514", key: "ANTHROPIC_API_KEY" },
  { model: "openai/gpt-4o", key: "OPENAI_API_KEY" },
  { model: "google/gemini-1.5-pro", key: "GOOGLE_GENERATIVE_AI_API_KEY" },
];

for (const { model, key } of providers) {
  const apiKey = process.env[key];
  if (!apiKey) continue;

  const agent = new TestAgent({ tools, model, apiKey, temperature: 0.1 });
  await suite.run(agent, { iterations: 20, concurrency: 3 });

  console.log(`${model}: ${(suite.accuracy() * 100).toFixed(1)}%`);
}
```

### Provider custom compatible OpenAI

```typescript
const agent = new TestAgent({
  tools,
  model: "my-provider/gpt-4",
  apiKey: process.env.MY_API_KEY,
  customProviders: {
    "my-provider": {
      name: "my-provider",
      protocol: "openai-compatible",
      baseUrl: "https://api.my-provider.com/v1",
      modelIds: ["gpt-4"],
    },
  },
});
```

### Lecture rapide des resultats

- Tous >90% : descriptions d'outils probablement claires
- Un seul provider echoue : descriptions possiblement trop specifiques a un modele
- Tous echouent : outils ambigus ou prompts mal cadres
- Variance elevee : baisse la temperature et augmente les iterations

## Exemple complet

```typescript
import { MCPClientManager, TestAgent, EvalSuite, EvalTest } from "@mcpjam/sdk";

async function main() {
  const manager = new MCPClientManager({
    myServer: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-everything"],
    },
  });
  await manager.connectToServer("myServer");

  const agent = new TestAgent({
    tools: await manager.getTools(),
    model: "anthropic/claude-sonnet-4-20250514",
    apiKey: process.env.ANTHROPIC_API_KEY!,
    temperature: 0.1,
  });

  const suite = new EvalSuite({ name: "Basic Operations" });
  suite.add(new EvalTest({
    name: "echo",
    test: async (a) => (await a.prompt("Echo 'test'")).hasToolCall("echo"),
  }));
  suite.add(new EvalTest({
    name: "add",
    test: async (a) => (await a.prompt("Add 1 and 2")).hasToolCall("add"),
  }));

  await suite.run(agent, { iterations: 30 });
  console.log(`Suite accuracy: ${(suite.accuracy() * 100).toFixed(1)}%`);

  await manager.disconnectServer("myServer");
}

main();
```
