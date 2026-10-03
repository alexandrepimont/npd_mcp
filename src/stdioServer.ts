import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './mcpServer.js';

export async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Factpages MCP server running on stdio');
}