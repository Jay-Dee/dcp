# Device Compliance Platform

Enterprise-style endpoint compliance and remediation platform built with:

- React
- Node.js
- Python
- AWS CDK
- LocalStack
- Docker

This project simulates cloud-native operational tooling used by internal platform and endpoint engineering teams to monitor device compliance, automate remediation workflows, and provide operational visibility across managed environments.

---

# Overview

The platform simulates enterprise device management workflows by:

- Receiving device health/compliance check-ins
- Evaluating compliance policies
- Triggering remediation workflows
- Recording audit activity
- Displaying operational dashboards

The project is designed to demonstrate:

- Cloud engineering
- Infrastructure as Code
- Event-driven architecture
- Operational automation
- Security-focused workflows
- CI/CD readiness
- Platform engineering concepts

---

# Architecture

```txt
┌─────────────────────┐
│ React Dashboard     │
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│ Node.js API         │
│ - Device ingestion  │
│ - Compliance checks │
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│ LocalStack AWS      │
│ - DynamoDB          │
│ - EventBridge       │
│ - SQS               │
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│ Python Worker       │
│ - Remediation       │
│ - Audit logging     │
└─────────────────────┘
```

---

# Features

## Device Check-In API

Simulated enterprise devices submit status reports:

```json
{
  "deviceId": "macbook-001",
  "os": "macOS",
  "diskEncrypted": false,
  "antivirusRunning": true,
  "lastPatchedDays": 12
}
```

---

## Compliance Engine

Evaluates security policies such as:

- Disk encryption enabled
- Antivirus running
- Patch age within policy threshold

Example violations:

- Encryption disabled
- Outdated patch level
- Missing endpoint protection

---

## Event-Driven Remediation

Non-compliant devices trigger automated remediation workflows using:

- EventBridge
- SQS
- Python remediation workers

Example remediation actions:

- Queue remediation task
- Generate audit event
- Raise operational alert

---

## Operational Dashboard

React dashboard displaying:

- Compliance status
- Active alerts
- Device inventory
- Remediation activity
- Risk levels

---

## Infrastructure as Code

AWS infrastructure defined using CDK:

- DynamoDB tables
- EventBridge rules
- SQS queues
- IAM permissions

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend API | Node.js + Express |
| Automation | Python |
| Infrastructure | AWS CDK |
| AWS Simulation | LocalStack |
| Containers | Docker Compose |
| CI/CD | GitHub Actions / GitLab CI |

---

# Project Structure

```txt
device-compliance-platform/
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

- Docker
- Node.js
- Python
- AWS CDK CLI

---

# Running the Platform

## 1. Start services

```bash
docker compose up
```

Starts:

- React frontend
- Node.js API
- Python worker
- LocalStack

---

## 2. Deploy infrastructure

```bash
cd infrastructure
npm install
cdk deploy
```

Deploys local AWS infrastructure into LocalStack.

---

## 3. Submit a simulated device check-in

```bash
curl -X POST http://localhost:3000/api/device/checkin \
-H "Content-Type: application/json" \
-d '{
  "deviceId":"macbook-001",
  "os":"macOS",
  "diskEncrypted":false,
  "antivirusRunning":true,
  "lastPatchedDays":12
}'
```

---

# Example Workflow

```txt
Device Check-In
        ↓
Compliance Evaluation
        ↓
Violation Detected
        ↓
Event Published
        ↓
Remediation Worker Triggered
        ↓
Audit Event Recorded
        ↓
Dashboard Updated
```

---

# Compliance Rules

| Rule | Severity |
|---|---|
| Disk encryption disabled | High |
| Antivirus disabled | High |
| Patch age > 7 days | Medium |

---

# Audit Logging

All remediation actions generate audit records.

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

# Goals

This project focuses on demonstrating:

- Enterprise cloud architecture
- Infrastructure automation
- Event-driven systems
- Operational support tooling
- Security-focused engineering workflows
- Platform engineering practices

---

# Future Improvements

- Authentication and RBAC
- Real-time dashboard updates
- Metrics and observability
- Scheduled compliance scans
- Device risk scoring
- Slack / Teams integrations
- Deployment environments (dev/staging/prod)

---

# Screenshots

_Add dashboard and infrastructure screenshots here._

---

# License

MIT
