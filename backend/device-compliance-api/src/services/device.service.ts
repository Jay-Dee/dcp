import crypto from "node:crypto";
import { DeviceRepository } from "../repositories/interfaces/device-repository";
import { AuditRepository } from "../repositories/interfaces/audit-repository";
import { EventStoreRepository } from "../repositories/interfaces/event-repository";
import { DeviceCheckIn, DeviceRecord } from "../types/device";
import { evaluateCompliance } from "./compliance.service";
import { auditRepository, deviceRepository, eventRepository } from "../container";

export class DeviceCheckInService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly auditRepository: AuditRepository,
    private readonly eventStoreRepository: EventStoreRepository
  ) {}
  
  processDeviceCheckIn(checkIn: DeviceCheckIn): DeviceRecord {
    const checkedInAt = new Date().toISOString();

  this.eventStoreRepository.append({
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

  this.deviceRepository.save(record);

  const auditEvent = this.auditRepository.save({
    auditId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    deviceId: record.deviceId,
    action: "COMPLIANCE_EVALUATED",
    actor: "device-compliance-api",
    status: record.status,
    violationCount: record.violations.length
  });

  this.eventStoreRepository.append({
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

  this.eventStoreRepository.append({
    eventId: crypto.randomUUID(),
    eventType: "AUDIT_EVENT_CREATED",
    aggregateId: auditEvent.auditId,
    aggregateType: "AUDIT",
    timestamp: auditEvent.timestamp,
    payload: auditEvent as unknown as Record<string, unknown>
  });

  return record;
  }
}

export const deviceCheckInService = new DeviceCheckInService(
  deviceRepository,
  auditRepository,
  eventRepository
);

