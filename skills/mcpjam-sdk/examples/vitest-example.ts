import { describe, expect, it } from 'vitest';
import { MCPClientManager, TestAgent } from '@mcpjam/sdk';

describe('Math MCP Server', () => {
  it('calls add for an addition prompt', async () => {
    const manager = new MCPClientManager({
      myServer: {
        command: 'node',
        args: ['./my-server.js'],
      },
    });

    await manager.connectToServer('myServer');

    const agent = new TestAgent({
      tools: await manager.getTools(),
      model: 'anthropic/claude-sonnet-4-20250514',
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: 0.1,
    });

    const result = await agent.prompt('Add 10 and 5');
    expect(result.hasToolCall('add')).toBe(true);

    await manager.disconnectServer('myServer');
  });
});
