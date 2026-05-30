import crypto from "node:crypto";

import { saveAuditEvent } from "../repositories/audit.repository";
import {
  saveDeviceRecord
} from "../repositories/device.repository";
import { appendEvent } from "../repositories/event.repository";

import { evaluateCompliance } from "./compliance.service";

import type { DeviceCheckIn, DeviceRecord } from "../types/device";

export function processDeviceCheckIn(
  checkIn: DeviceCheckIn
): DeviceRecord {

  const checkedInAt = new Date().toISOString();

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "DEVICE_CHECKED_IN",
    aggregateId: checkIn.deviceId,
    aggregateType: "DEVICE",
    timestamp: checkedInAt,
    payload: checkIn as unknown as Record<string, unknown>
  });

  const result = evaluateCompliance(checkIn);

  const record: DeviceRecord = {
    ...checkIn,
    status: result.status,
    violations: result.violations,
    checkedInAt
  };

  saveDeviceRecord(record);

  const auditEvent = saveAuditEvent({
    auditId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    deviceId: record.deviceId,
    action: "COMPLIANCE_EVALUATED",
    actor: "device-compliance-api",
    status: record.status,
    violationCount: record.violations.length
  });

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "COMPLIANCE_EVALUATED",
    aggregateId: record.deviceId,
    aggregateType: "DEVICE",
    timestamp: new Date().toISOString(),
    payload: {
      status: record.status,
      violationCount: record.violations.length
    }
  });

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "AUDIT_EVENT_CREATED",
    aggregateId: auditEvent.auditId,
    aggregateType: "AUDIT",
    timestamp: auditEvent.timestamp,
    payload: auditEvent as unknown as Record<string, unknown>
  });

  return record;
}