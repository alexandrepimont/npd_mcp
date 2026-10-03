---
name: factpages-mcp-refactor
description: Guidelines and tasks for refactoring an MCP server encapsulating Norwegian Offshore Directorate (FactPages) data tables to map raw CSV schemas to business meaning. Use when structuring or refactoring FactPages MCP repositories.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".

---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->


## Instructions

1. Core Architecture & Repository Tasks
Modular Data Ingestion: Background or on-demand fetchers to download and cache daily FactPages CSVs/Excel exports locally.
SQLite / Relational Layer: Parse raw CSVs into a lightweight SQLite database to enable robust foreign key relationships (JOIN operations between fields, discoveries, and wellbores).
Semantic Mapping Layer: Maintain an explicit domain glossary mapping cryptic abbreviations (e.g., fldName, wlbName, dscReservesRecoverable) to clear operational definitions and units (e.g., Standard Cubic Meters).
Structured MCP Tools & Resources: Expose targeted query/lookup tools instead of raw file dumps, accompanied by static resource documents describing table schemas and business rules.

2. Tool Design & Schema Validation
Strict Zod Schemas: Define input and output structures for every tool via inputSchema using Zod.
Descriptive Documentation: Include detailed .describe(...) metadata for all fields and parameters to ensure the LLM understands tool intent.
Action-Oriented Naming: Use concise, lowercase, snake_case tool names (e.g., query_sodir_table, get_field_details).
Comprehensive Testing: Implement unit tests covering valid and invalid query inputs.

3. Error Handling & Response Structure
Internal Exception Catching: Wrap all tool execution logic in try/catch blocks to prevent process crashes.
Structured Error Payloads: Return an explicit error response structure when failures occur:
return {
    isError: true,
    content: [{
        type: 'text',
        text: `Error description: ${error instanceof Error ? error.message : String(error)}`
    }]
};