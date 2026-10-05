# NPD FactPages MCP

## Goal

This project exposes Norway SODIR/NPD FactPages tables as a reliable MCP server, with a narrow focus on:

1. Table discovery.
2. Table fetch as structured rows.
3. Deterministic table enrichment and join reachability planning over wellbore data.

## Simplified Architecture

Runtime flow:

1. [src/app/main.ts](src/app/main.ts) boots the process.
2. [src/transport/stdio.ts](src/transport/stdio.ts) connects stdio transport.
3. [src/mcp/server.ts](src/mcp/server.ts) defines MCP tools and shared safe response behavior.
4. [src/factpages/client.ts](src/factpages/client.ts) resolves table routes, builds URLs, fetches CSV, parses rows.
5. [src/domain/wellbore/business.ts](src/domain/wellbore/business.ts) plans table enrichment and join reachability for a selected wellbore table.
6. [src/semantic/metrics.ts](src/semantic/metrics.ts) remains a supporting metric catalog for legacy deterministic summaries.
7. [knowledge_graph/factpages/wellbore/tables.ts](knowledge_graph/factpages/wellbore/tables.ts) is the active metadata source for supported tables.

## File Focus

### Root

1. [config.yaml](config.yaml): MCP client/server runtime configuration.
2. [package.json](package.json): scripts and dependencies.
3. [READ.md](READ.md): architecture and file-focus documentation.
4. [README.md](README.md): default project documentation entrypoint.

### Source Runtime

1. [src/app/main.ts](src/app/main.ts): process entrypoint and fatal error boundary.
2. [src/transport/stdio.ts](src/transport/stdio.ts): MCP stdio server startup.
3. [src/mcp/server.ts](src/mcp/server.ts): tool registration, zod input schemas, shared MCP-safe success/error responses.
4. [src/factpages/client.ts](src/factpages/client.ts): table key normalization, route resolution, URL construction, HTTP fetch with timeout, CSV parsing.
5. [src/domain/wellbore/business.ts](src/domain/wellbore/business.ts): table enrichment planning and join reachability generation with provenance.
6. [src/semantic/metrics.ts](src/semantic/metrics.ts): legacy signal catalog and metric computations retained for compatibility.

### Knowledge Graph Core

1. [knowledge_graph/README.md](knowledge_graph/README.md): metadata design intent.
2. [knowledge_graph/factpages/index.ts](knowledge_graph/factpages/index.ts): aggregate exports and category index.
3. [knowledge_graph/factpages/definitions.ts](knowledge_graph/factpages/definitions.ts): shared metadata types and section definitions.

### Knowledge Graph Implemented Section

1. [knowledge_graph/factpages/wellbore/index.ts](knowledge_graph/factpages/wellbore/index.ts): wellbore section composition.
2. [knowledge_graph/factpages/wellbore/tables.ts](knowledge_graph/factpages/wellbore/tables.ts): canonical wellbore table metadata used by runtime tools.

### Knowledge Graph Planned Sections

1. [knowledge_graph/factpages/baa/index.ts](knowledge_graph/factpages/baa/index.ts): planned BAA section metadata.
2. [knowledge_graph/factpages/co2_storage/index.ts](knowledge_graph/factpages/co2_storage/index.ts): planned CO2 storage metadata.
3. [knowledge_graph/factpages/company/index.ts](knowledge_graph/factpages/company/index.ts): planned company metadata.
4. [knowledge_graph/factpages/discovery/index.ts](knowledge_graph/factpages/discovery/index.ts): planned discovery metadata.
5. [knowledge_graph/factpages/facility/index.ts](knowledge_graph/factpages/facility/index.ts): planned facility metadata.
6. [knowledge_graph/factpages/field/index.ts](knowledge_graph/factpages/field/index.ts): planned field metadata.
7. [knowledge_graph/factpages/license/index.ts](knowledge_graph/factpages/license/index.ts): planned license metadata.
8. [knowledge_graph/factpages/stratigraphy/index.ts](knowledge_graph/factpages/stratigraphy/index.ts): planned stratigraphy metadata.
9. [knowledge_graph/factpages/survey/index.ts](knowledge_graph/factpages/survey/index.ts): planned survey metadata.
10. [knowledge_graph/factpages/tuf/index.ts](knowledge_graph/factpages/tuf/index.ts): planned TUF metadata.

### Scripts

1. [knowledge_graph/scripts/print_factpages_knowledge.ts](knowledge_graph/scripts/print_factpages_knowledge.ts): prints knowledge graph sections for quick inspection.

### Tests

1. [test/unit/factpages-client.unit.test.ts](test/unit/factpages-client.unit.test.ts): unit tests for URL building, CSV parsing, and validation helpers.
2. [test/integration/knowledge-graph.integration.test.ts](test/integration/knowledge-graph.integration.test.ts): integration checks for FactPages section metadata completeness.
3. [test/integration/wellbore-business.integration.test.ts](test/integration/wellbore-business.integration.test.ts): integration tests for join planning and table enrichment reachability.
4. [test/e2e/mcp-tools.e2e.test.ts](test/e2e/mcp-tools.e2e.test.ts): end-to-end MCP tool calls through in-memory client/server transports.
5. [test/business/question-answering.business.test.ts](test/business/question-answering.business.test.ts): business-focused tool tests that verify table enrichment and join reachability behavior.

## Current Simplification Rules

1. Keep tools small and table-oriented.
2. Keep all tool errors structured via a single MCP error shape.
3. Keep transport bootstrapping separate from tool registration.
4. Keep join planning deterministic and testable without live network data.
5. Prefer enriching a base table and exposing reachable related tables instead of answering a single ad hoc question.
