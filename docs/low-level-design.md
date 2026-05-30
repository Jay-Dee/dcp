
# Low-Level Design

## Device Compliance Platform

---

## 1. Purpose

This document describes the low-level design of the current MVP implementation.

It focuses on backend routes, services, repositories, data models, validation, frontend API usage, and local runtime behaviour.

---

## 2. Backend Structure

```txt
backend/device-compliance-api/
├── src/
│   ├── container.ts
│   ├── logger.ts
│   ├── server.ts
│   ├── routes/
│   │   ├── health.routes.ts
│   │   ├── device.routes.ts
│   │   ├── audit.routes.ts
│   │   ├── event-store.routes.ts
│   │   └── summary.routes.ts
│   ├── services/
│   │   ├── compliance.service.ts
│   │   ├── device-checkin.service.ts
│   │   └── dashboard-summary.service.ts
│   ├── repositories/
│   │   ├── memory-device.repository.ts
│   │   ├── memory-audit.repository.ts
│   │   ├── memory-event-store.repository.ts
│   │   └── interfaces/
│   │       ├── device-repository.ts
│   │       ├── audit-repository.ts
│   │       └── event-store-repository.ts
│   ├── schemas/
│   │   └── device.schema.ts
│   └── types/
│       ├── device.ts
│       ├── audit.ts
│       └── domain-event.ts