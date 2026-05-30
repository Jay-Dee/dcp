

# High-Level Design

## Device Compliance Platform

---

## 1. Purpose

The Device Compliance Platform is a local-first operational tool that simulates endpoint compliance monitoring.

It allows device compliance data to be submitted to an API, evaluates the device against security policies, records audit and domain events, and displays the current operational state through a read-only React dashboard.

The design is intentionally minimal to support fast local development, clear demonstration, and future extension into cloud-style infrastructure using AWS CDK and LocalStack.

---

## 2. Goals

The platform is designed to demonstrate:

- Endpoint compliance workflows
- Node.js API development
- React dashboard development
- Validation and structured logging
- Service-oriented backend design
- Repository abstraction
- Event-store style traceability
- Audit logging
- Local Docker-based development
- Future Infrastructure as Code using AWS CDK

---

## 3. Non-Goals

The MVP does not currently include:

- Real AWS deployment
- Authentication or RBAC
- Real endpoint agent software
- EventBridge
- SQS
- Python remediation worker
- Persistent database storage
- WebSockets or real-time push updates
- Production-grade monitoring

These are future extensions.

---

## 4. System Context

```txt
Developer / Demo User
        |
        | uses
        v
VS Code REST Client
        |
        | submits check-ins
        v
Device Compliance API
        |
        | exposes read-only data
        v
React Dashboard