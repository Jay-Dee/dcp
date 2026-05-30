# Device Compliance Platform

A local-first endpoint compliance and operational visibility platform.

The project simulates how an endpoint engineering or platform team might receive device compliance check-ins, evaluate security policy status, record audit activity, and expose operational data through a read-only dashboard.

The current MVP is intentionally minimal and can be run entirely locally without a cloud account.

---

## Current MVP Scope

The current implementation includes:

- Node.js + TypeScript compliance API
- React + TypeScript read-only dashboard
- Device check-in endpoint
- Compliance evaluation engine
- Zod request validation
- In-memory device repository
- In-memory audit repository
- In-memory event store
- Dashboard summary endpoint
- Structured logging with Pino
- Docker Compose development environment
- VS Code `.http` API test requests
- Unit tests for core compliance workflow
- Initial CI build/test workflow

---

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend API | Node.js, Express, TypeScript |
| Validation | Zod |
| Logging | Pino, pino-http |
| Testing | Vitest |
| Local Runtime | Docker Compose |
| Future IaC | AWS CDK |
| Future Local Cloud Simulation | LocalStack |

---

## Architecture

```txt
Device / API Test Client
        |
        v
Node.js Compliance API
        |
        v
Device Check-In Service
        |
        +--> Compliance Engine
        |
        +--> Device Repository
        |
        +--> Audit Repository
        |
        +--> Event Store Repository
        |
        v
React Read-Only Dashboard