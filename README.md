# Endpoint Compliance & Automation Platform

Cloud-native endpoint compliance platform built to simulate the operational tooling used by endpoint engineering and platform teams.

The platform receives device compliance check-ins, evaluates security policies, triggers automated remediation workflows, and records audit activity.

The project demonstrates:

* AWS cloud development
* Event-driven architecture
* Infrastructure as Code
* Operational automation
* Security-focused workflows
* Platform engineering concepts

---

# Technology Stack

| Layer          | Technology         |
| -------------- | ------------------ |
| Frontend       | React + TypeScript |
| Backend API    | Node.js + Express  |
| Automation     | Python             |
| Infrastructure | AWS CDK            |
| AWS Simulation | LocalStack         |
| Containers     | Docker Compose     |

---

# Architecture

```txt
┌─────────────────────┐
│ React Dashboard     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Node.js API         │
│ - Device Check-In   │
│ - Compliance Engine │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ DynamoDB            │
│ Device Records      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ EventBridge         │
│ Compliance Events   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ SQS                 │
│ Remediation Queue   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Python Worker       │
│ - Remediation       │
│ - Audit Logging     │
└─────────────────────┘
```

---

# Features

## Device Check-In API

Managed devices submit compliance reports.

Example:

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

The API evaluates incoming device reports against security policies.

### Compliance Rules

| Rule                          | Severity |
| ----------------------------- | -------- |
| Disk encryption disabled      | High     |
| Antivirus disabled            | High     |
| Patch age greater than 7 days | Medium   |

---

## Event-Driven Remediation

Non-compliant devices trigger automated remediation workflows.

Workflow:

```txt
Device Check-In
        ↓
Compliance Evaluation
        ↓
Violation Detected
        ↓
Event Published
        ↓
Remediation Queued
        ↓
Audit Event Recorded
```

The workflow is implemented using:

* EventBridge
* SQS
* Python remediation workers

---

## Audit Logging

All automated remediation actions generate audit records.

Example:

```json
{
  "timestamp": "2026-05-29T12:00:00Z",
  "deviceId": "macbook-001",
  "action": "REMEDIATION_QUEUED",
  "actor": "automation-worker"
}
```

---

## Operational Dashboard

The React dashboard provides visibility into platform activity.

### Fleet Summary

* Total devices
* Compliant devices
* Non-compliant devices

### Device Inventory

* Device ID
* Platform
* Compliance status

### Active Remediations

* Device
* Violation
* Status

---

## Structured Logging

The platform uses structured JSON logging to support operational troubleshooting and auditability.

Example:

```json
{
  "event": "compliance_violation",
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "severity": "HIGH"
}
```

---

## Infrastructure as Code

AWS resources are provisioned using AWS CDK.

Infrastructure includes:

* DynamoDB
* EventBridge
* SQS
* IAM permissions

Local AWS services are provided using LocalStack.

---

# Project Structure

```txt
endpoint-compliance-platform/
│
├── frontend/
├── backend/
├── worker/
├── infrastructure/
├── docker/
├── docs/
└── docker-compose.yml
```

---

# Local Development

## Requirements

* Docker
* Node.js
* Python
* AWS CDK CLI

---

## Start Services

```bash
docker compose up
```

This starts:

* React frontend
* Node.js API
* Python worker
* LocalStack

---

## Deploy Infrastructure

```bash
cd infrastructure
npm install
cdk deploy
```

Deploys AWS resources into LocalStack.

---

## Submit a Device Check-In

```bash
curl -X POST http://localhost:3000/api/device/checkin \
-H "Content-Type: application/json" \
-d '{
  "deviceId":"macbook-001",
  "platform":"macOS",
  "diskEncrypted":false,
  "antivirusRunning":true,
  "lastPatchedDays":12
}'
```

---

# CI Pipeline

The project includes a basic CI pipeline that validates code quality before deployment.

Pipeline stages:

```txt
Lint
 ↓
Test
 ↓
Build
```

---

# Project Goals

This project focuses on demonstrating:

* Cloud-native development
* AWS services and Infrastructure as Code
* Event-driven systems
* Operational automation
* Endpoint compliance workflows
* Platform engineering practices

---

# Future Improvements

* Additional compliance policies
* Dashboard visualisations
* Scheduled compliance scans
* Deployment environments
* Expanded remediation workflows

---

# License

MIT
