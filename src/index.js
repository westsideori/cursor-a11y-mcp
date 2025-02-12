import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  a11yToolName,
  a11yToolDescription,
  A11yToolSchema,
  runA11yTool,
} from './tools/a11y.js';

/**
 * A minimal MCP server providing an A11y Tool
 */
// 1. Create an MCP server instance
const server = new Server(
  {
    name: 'cursor-tools',
    version: '2.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. Define the list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: a11yToolName,
        description: a11yToolDescription,
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Full URL to test',
            },
            relativePath: {
              type: 'string',
              description: 'Relative path appended to http://localhost:5000',
            },
          },
          required: [],
        },
      },
    ],
  };
});

// 3. Implement the tool call logic
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  switch (name) {
    case a11yToolName: {
      const validated = A11yToolSchema.parse(args);
      return await runA11yTool(validated);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 4. Start the MCP server with a stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Cursor Tools MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
