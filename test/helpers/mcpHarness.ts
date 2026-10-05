import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import { createMcpServer } from '../../src/mcp/server.ts';

export type ConnectedMcpTestClient = {
  client: Client;
  close: () => Promise<void>;
};

export async function connectMcpTestClient(): Promise<ConnectedMcpTestClient> {
  const server = createMcpServer();
  const client = new Client(
    {
      name: 'npd-mcp-test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  return {
    client,
    close: async () => {
      await Promise.allSettled([server.close(), clientTransport.close(), serverTransport.close()]);
    },
  };
}

export function parseJsonToolResponse(result: { content: { type: string; text?: string }[]; isError?: boolean }): unknown {
  const textPart = result.content.find((item) => item.type === 'text' && typeof item.text === 'string');
  if (!textPart?.text) {
    throw new Error('Expected text tool response content.');
  }

  if (result.isError) {
    throw new Error(`Tool returned error: ${textPart.text}`);
  }

  return JSON.parse(textPart.text);
}
