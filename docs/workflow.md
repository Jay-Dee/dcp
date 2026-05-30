# Endpoint Compliance & Automation Platform

## Workflow Document

### Purpose

This document describes the operational workflows within the Endpoint Compliance & Automation Platform.

The platform is designed to demonstrate how endpoint engineering teams can automate compliance monitoring and remediation using cloud-native, event-driven architecture.

All workflows are designed to run locally using Docker, LocalStack, and AWS CDK.

---

# Platform Workflow Overview

```txt
Managed Device
       │
       ▼
Node.js API
       │
       ▼
Compliance Engine
       │
       ▼
EventBridge
       │
       ▼
SQS Queue
       │
       ▼
Python Worker
       │
       ▼
Audit Logging
       │
       ▼
Dashboard
```

---

# Workflow 1: Device Check-In

## Objective

Receive and process a compliance report from a managed device.

## Trigger

Device submits a status report.

## Components

* Managed Device
* Node.js API
* DynamoDB

## Process

```txt
Device
   │
   ▼
POST /api/device/checkin
   │
   ▼
Validate Payload
   │
   ▼
Store Device Record
   │
   ▼
Start Compliance Evaluation
```

## Outcome

The latest device state is stored and available for compliance evaluation.

---

# Workflow 2: Compliance Evaluation

## Objective

Evaluate device data against security policies.

## Trigger

Successful device check-in.

## Components

* Node.js API
* Compliance Engine

## Policies

| Policy                   | Severity |
| ------------------------ | -------- |
| Disk encryption disabled | High     |
| Antivirus disabled       | High     |
| Patch age > 7 days       | Medium   |

## Process

```txt
Device Record
      │
      ▼
Evaluate Policies
      │
      ├── Compliant
      │        │
      │        ▼
      │   Update Status
      │
      └── Non-Compliant
               │
               ▼
        Create Violation Event
```

## Outcome

Device is marked compliant or non-compliant.

---

# Workflow 3: Event Publication

## Objective

Publish compliance violations for asynchronous processing.

## Trigger

Compliance violation detected.

## Components

* Compliance Engine
* EventBridge

## Process

```txt
Violation Detected
       │
       ▼
Create Event
       │
       ▼
Publish to EventBridge
```

## Example Event

```json
{
  "eventType": "COMPLIANCE_VIOLATION",
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "severity": "HIGH"
}
```

## Outcome

Violation is distributed to downstream consumers.

---

# Workflow 4: Remediation Queue Processing

## Objective

Queue remediation work for processing.

## Trigger

Compliance violation event received.

## Components

* EventBridge
* SQS

## Process

```txt
EventBridge
      │
      ▼
Event Rule Match
      │
      ▼
SQS Queue
```

## Outcome

Remediation work is decoupled from the API.

---

# Workflow 5: Automated Remediation

## Objective

Process remediation requests.

## Trigger

Message available in remediation queue.

## Components

* SQS
* Python Worker

## Process

```txt
SQS Message
      │
      ▼
Worker Receives Message
      │
      ▼
Create Remediation Record
      │
      ▼
Generate Audit Event
```

## Example Remediation

```json
{
  "deviceId": "macbook-001",
  "action": "REMEDIATION_QUEUED"
}
```

## Outcome

Remediation activity is recorded.

---

# Workflow 6: Audit Logging

## Objective

Provide traceability for automated actions.

## Trigger

Worker processes remediation event.

## Components

* Python Worker
* Audit Store

## Process

```txt
Remediation Action
        │
        ▼
Generate Audit Record
        │
        ▼
Store Audit Event
```

## Example Audit Record

```json
{
  "timestamp": "2026-05-29T12:00:00Z",
  "deviceId": "macbook-001",
  "action": "REMEDIATION_QUEUED",
  "actor": "automation-worker"
}
```

## Outcome

Operational activity is traceable and reviewable.

---

# Workflow 7: Dashboard Monitoring

## Objective

Provide visibility into platform activity.

## Trigger

User accesses dashboard.

## Components

* React Dashboard
* Node.js API

## Process

```txt
Dashboard Request
        │
        ▼
Retrieve Device Data
        │
        ▼
Retrieve Remediation Data
        │
        ▼
Display Platform Status
```

## Dashboard Views

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

## Outcome

Engineers can monitor platform activity from a single interface.

---

# Operational Logging Workflow

## Objective

Provide structured logs for troubleshooting and support.

## Components

* Node.js API
* Python Worker

## Process

```txt
Application Event
        │
        ▼
Structured JSON Log
        │
        ▼
Console Output
```

## Example

```json
{
  "event": "compliance_violation",
  "deviceId": "macbook-001",
  "rule": "DISK_ENCRYPTION",
  "severity": "HIGH"
}
```

## Outcome

Platform activity can be monitored and investigated.

---

# End-to-End Workflow

```txt
Device Check-In
        │
        ▼
API Validation
        │
        ▼
Store Device State
        │
        ▼
Compliance Evaluation
        │
        ▼
Violation Detected
        │
        ▼
EventBridge Event
        │
        ▼
SQS Queue
        │
        ▼
Python Worker
        │
        ▼
Audit Record Created
        │
        ▼
Dashboard Updated
```

---

# Failure Handling

## API Failure

If the API is unavailable:

```txt
Device
   │
   ▼
Request Failed
   │
   ▼
Retry Later
```

---

## Event Publication Failure

If EventBridge is unavailable:

```txt
Violation Detected
        │
        ▼
Log Error
        │
        ▼
Return Failure Status
```

---

## Worker Failure

If remediation processing fails:

```txt
Worker Error
      │
      ▼
Log Failure
      │
      ▼
Message Remains In Queue
```

---

# Demonstration Scenario

1. Start LocalStack.
2. Deploy infrastructure using CDK.
3. Start API, worker, and dashboard.
4. Submit a non-compliant device.
5. Observe compliance violation.
6. Verify EventBridge event.
7. Verify SQS message.
8. Verify worker processing.
9. Verify audit record creation.
10. Verify dashboard updates.

This scenario demonstrates the complete event-driven workflow without requiring access to a public cloud environment.
