# Endpoint Compliance & Automation Platform

## High-Level Design

### Purpose

This document describes the high-level design for the Endpoint Compliance & Automation Platform.

The platform is intended to be implemented as a local demonstration project that simulates a cloud-native endpoint compliance system. It demonstrates how endpoint engineering and platform teams can collect device posture data, evaluate compliance rules, trigger event-driven remediation workflows, and provide operational visibility through a dashboard.

All major cloud services are designed to run locally using Docker Compose, LocalStack, and AWS CDK so the full workflow can be demonstrated without requiring access to a live AWS account.

---

# Design Goals

The platform is designed around the following goals:

* Provide a realistic endpoint compliance workflow for demo and learning purposes.
* Keep all services runnable on a local developer machine.
* Use event-driven architecture to decouple compliance evaluation from remediation processing.
* Store device, remediation, and audit data in a way that supports dashboard visibility.
* Use structured logging to make platform behavior easy to observe during demonstrations.
* Model cloud-native operational patterns using AWS-compatible services through LocalStack.

---

# System Context

```txt
Managed Device / Demo Client
          │
          │ publishes compliance record
          ▼
      Node.js API
          │
          ├──────────────► DynamoDB
          │                  Device Records
          │
          ▼
   Compliance Engine
          │
          ▼
      EventBridge
          │
          ▼
          SQS
          │
          ▼
    Python Worker
          │
          ▼
   Audit / Remediation Records

React Dashboard
          │
          │ reads platform state
          ▼
      Node.js API
```

Managed devices publish compliance records to the backend API. The backend API validates and stores the latest device posture, evaluates compliance rules, and emits events for non-compliant devices. EventBridge routes compliance violation events to SQS, where a Python worker processes remediation work asynchronously and records audit activity.

The React dashboard does not interact directly with managed devices. As described in `docs/workflow.md`, the dashboard is a monitoring view that retrieves platform state from the Node.js API after device records, remediation records, and audit activity have been created.

---

# Major Components

## React Dashboard

The dashboard is the user-facing interface for viewing platform state.

### Responsibilities

* Display fleet compliance summary.
* Display device inventory.
* Display active remediation activity.
* Display audit or operational events where available.
* Call backend API endpoints for data retrieval.

### Local Demo Role

The dashboard should run locally in a browser and communicate only with the local Node.js API over HTTP. It should not receive traffic from devices or publish compliance records on behalf of devices.

---

## Device Compliance Publisher

Managed devices, or local demo clients acting as managed devices, publish compliance records to the backend API.

### Responsibilities

* Collect or simulate local device posture data.
* Build a compliance record containing device identity, platform, and security posture fields.
* Publish the compliance record to the backend API over HTTP.
* Retry later if the backend API is unavailable.
* Remain independent from the dashboard workflow.

### Local Demo Role

For the local project, devices can be represented by `curl`, scripts, seed data, or a lightweight demo client that submits compliance records to the API.

---

## Node.js API

The Node.js API is the primary backend service for device check-ins and dashboard data access.

### Responsibilities

* Expose a device compliance record publishing endpoint.
* Validate incoming device compliance records.
* Persist device records.
* Run compliance evaluation logic.
* Publish compliance violation events.
* Expose read endpoints for dashboard views.
* Produce structured JSON logs.

### Key Endpoint

```txt
POST /api/device/checkin
```

Example request:

```json
{
  "deviceId": "macbook-001",
  "platform": "macOS",
  "diskEncrypted": false,
  "antivirusRunning": true,
  "lastPatchedDays": 12
}
```

---

## Compliance Engine

The compliance engine evaluates published device compliance records against a fixed set of security policies.

### Initial Rules

| Rule                          | Condition                    | Severity |
| ----------------------------- | ---------------------------- | -------- |
| Disk encryption disabled      | `diskEncrypted === false`    | High     |
| Antivirus disabled            | `antivirusRunning === false` | High     |
| Patch age greater than 7 days | `lastPatchedDays > 7`        | Medium   |

### Responsibilities

* Evaluate a normalized device compliance record.
* Return compliance status.
* Return one or more violation records.
* Trigger event publication when violations are found.

---

## DynamoDB

DynamoDB stores platform state for the local demo environment.

### Expected Data

* Device records.
* Compliance status.
* Violation summaries.
* Remediation records.
* Audit records.

### Local Demo Role

DynamoDB is provided by LocalStack. Tables are provisioned through AWS CDK and accessed by the Node.js API and Python worker using local AWS endpoints.

---

## EventBridge

EventBridge is used to model event-driven routing between compliance evaluation and remediation processing.

### Responsibilities

* Receive compliance violation events from the API.
* Match violation events using an event rule.
* Route matching events to the remediation SQS queue.

### Example Event

```json
{
  "eventType": "COMPLIANCE_VIOLATION",
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "severity": "HIGH"
}
```

---

## SQS

SQS decouples remediation processing from the API request lifecycle.

### Responsibilities

* Receive remediation messages from EventBridge.
* Buffer work until the Python worker is ready to process it.
* Preserve messages when worker processing fails.

---

## Python Worker

The Python worker processes remediation queue messages.

### Responsibilities

* Poll the remediation SQS queue.
* Parse compliance violation messages.
* Create remediation records.
* Create audit records.
* Delete successfully processed messages.
* Produce structured JSON logs.

### Local Demo Role

The worker simulates remediation rather than making real endpoint changes. For demo purposes, remediation actions should be represented as records and logs.

---

## AWS CDK Infrastructure

AWS CDK defines the AWS-compatible resources required by the platform.

### Responsibilities

* Define DynamoDB tables.
* Define EventBridge bus and rules.
* Define SQS queues.
* Define IAM permissions required by local services.
* Support deployment into LocalStack.

---

## Docker Compose

Docker Compose provides local orchestration for the demo environment.

### Responsibilities

* Start the React frontend.
* Start the Node.js API.
* Start the Python worker.
* Start LocalStack.
* Provide shared environment variables for local AWS endpoints.

---

# Data Model

## Device Record

```json
{
  "deviceId": "macbook-001",
  "platform": "macOS",
  "diskEncrypted": false,
  "antivirusRunning": true,
  "lastPatchedDays": 12,
  "complianceStatus": "NON_COMPLIANT",
  "lastCheckInAt": "2026-05-29T12:00:00Z"
}
```

## Violation Record

```json
{
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "severity": "HIGH",
  "message": "Disk encryption is disabled",
  "detectedAt": "2026-05-29T12:00:00Z"
}
```

## Remediation Record

```json
{
  "remediationId": "rem-001",
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "status": "QUEUED",
  "createdAt": "2026-05-29T12:00:00Z"
}
```

## Audit Record

```json
{
  "timestamp": "2026-05-29T12:00:00Z",
  "deviceId": "macbook-001",
  "action": "REMEDIATION_QUEUED",
  "actor": "automation-worker"
}
```

---

# Runtime Flow

```txt
1. Device or demo client publishes a compliance record to the Node.js API.
2. API validates the payload.
3. API stores or updates the device record in DynamoDB.
4. Compliance engine evaluates the device posture.
5. API updates the device compliance status.
6. If violations exist, API publishes a compliance violation event to EventBridge.
7. EventBridge routes matching violation events to SQS.
8. Python worker receives the message from SQS.
9. Worker creates remediation and audit records.
10. Dashboard retrieves updated platform state from the API for monitoring.
```

---

# Local Development Architecture

```txt
Developer Machine
│
├── Docker Compose
│   ├── frontend
│   ├── backend-api
│   ├── worker
│   └── localstack
│
├── AWS CDK
│   └── provisions resources into LocalStack
│
└── Demo Client
    └── curl / browser / scripted compliance record publishing
```

The local development environment should prioritize repeatability. A developer should be able to clone the repository, install dependencies, start containers, deploy local infrastructure, and publish a demo device compliance record.

---

# Configuration

The platform should use environment variables for runtime configuration.

| Variable                 | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| `PORT`                   | Backend API port                         |
| `AWS_REGION`             | Local AWS region                         |
| `AWS_ENDPOINT_URL`       | LocalStack endpoint                      |
| `DEVICES_TABLE_NAME`     | DynamoDB table for device records        |
| `REMEDIATION_TABLE_NAME` | DynamoDB table for remediation records   |
| `AUDIT_TABLE_NAME`       | DynamoDB table for audit records         |
| `EVENT_BUS_NAME`         | EventBridge bus name                     |
| `REMEDIATION_QUEUE_URL`  | SQS queue URL used by the Python worker  |

---

# Observability

All services should emit structured JSON logs.

Example API log:

```json
{
  "event": "compliance_violation",
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "severity": "HIGH"
}
```

Example worker log:

```json
{
  "event": "remediation_queued",
  "deviceId": "macbook-001",
  "actor": "automation-worker"
}
```

Structured logs make the demo easier to inspect from container output and support troubleshooting when LocalStack resources or service integrations are misconfigured.

---

# Failure Handling

## API Validation Failure

Invalid compliance record payloads should return a client error and should not create device records or compliance events.

## Event Publication Failure

If EventBridge publication fails, the API should log the error and return a clear failure response or degraded status depending on implementation requirements.

## Worker Processing Failure

If the Python worker fails to process a message, the error should be logged and the message should remain available for retry according to SQS visibility timeout behavior.

## LocalStack Unavailable

If LocalStack is unavailable, services should fail fast with clear logs indicating that AWS-compatible dependencies cannot be reached.

---

# Security Considerations

Although this is a local demo project, the design should still model secure engineering practices:

* Validate all API input.
* Avoid hard-coded secrets.
* Use least-privilege IAM definitions in CDK where practical.
* Keep remediation actions simulated and non-destructive.
* Use clear audit records for automated actions.

---

# Demonstration Scenario

The target demonstration flow is:

1. Start local services with Docker Compose.
2. Deploy infrastructure into LocalStack with AWS CDK.
3. Publish a non-compliant device compliance record to the backend API.
4. Observe the device record and compliance status.
5. Observe a compliance violation event.
6. Observe remediation work queued in SQS.
7. Observe the Python worker process the message.
8. Observe remediation and audit records.
9. View fleet status in the dashboard.

---

# Current Implementation Notes

The repository currently contains the project README, backend folder, and workflow documentation. The README describes additional planned folders such as `frontend/`, `worker/`, `infrastructure/`, `docker/`, and `docker-compose.yml`.

This high-level design should guide future implementation of those components while keeping the scope suitable for a local demonstration project.