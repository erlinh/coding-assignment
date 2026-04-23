# ADR-002: Immutable Data for Domain Models

**Status:** Accepted
**Date:** 2026-02-19

## Context

Data flows through multiple pipeline stages. We need to prevent accidental mutation between stages while keeping transformations readable.

## Decision

Use immutable data structures. Transformations create new instances rather than mutating existing objects.

## Consequences

- No shared mutable state between pipeline stages
- Clear data ownership — each stage gets input, returns new output
- Transformations are explicit about what changes
- Services can safely process data concurrently
