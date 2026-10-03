---
name: development
description: Describe what this custom agent does and when to use it.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

# MCP Server Development Guidelines

This document outlines the architectural standards, coding patterns, and best practices for developing and maintaining Model Context Protocol (MCP) tools within this repository.

## 1. Tool Design & Schema Validation
- **Strict Schemas:** Always use Zod to define input and output structures for every tool via `inputSchema`.
- **Descriptive Documentation:** Every field and tool must include clear `.describe(...)` metadata. The LLM relies entirely on these descriptions to understand tool intent and parameter requirements.
- **Action-Oriented Naming:** Tool names should be concise, lowercase, and use snake_case (e.g., `encrypt_message`, `get_customer`).
- **Unit Testing:** Implement comprehensive unit tests for each tool, covering both valid and invalid input scenarios. Use Jest or a similar testing framework.

## 2. Error Handling & Response Structure
- **Catch Internally:** Never let unhandled exceptions crash the process. Wrap all tool execution logic in `try/catch` blocks.
- **Structured Error Payloads:** When an error occurs, return an explicit error response structure so the LLM can interpret the failure:
  ```typescript
  return {
      isError: true,
      content: [{
          type: 'text',
          text: `Error description: ${error instanceof Error ? error.message : String(error)}`
      }]
  };
  ```