# Factpages knowledge graph

This folder holds the AI-friendly metadata for every Factpages table exposed by the project.

## Purpose

The metadata is designed to help an AI model understand:

- which table key to use
- what the human-readable label means
- which route is used in the public CSV URL
- why the table exists
- which questions it is best suited for

## Main export

The canonical knowledge graph lives in `knowledge_graph/factpages/definitions.ts`.

Each item includes:

- `key`
- `label`
- `route`
- `category`
- `explanation`
- `aiSummary`
- `relatedTerms`
- `useCases`
- `queryHints`
- `urlTemplate`
- `source`

## URL pattern

```ts
https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false
```

This pattern is used in the runtime service as the public CSV export endpoint.
