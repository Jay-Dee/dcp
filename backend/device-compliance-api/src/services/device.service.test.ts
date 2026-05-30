import { describe, expect, it } from "vitest";

import { DeviceCheckInService } from "./device.service";
import type { AuditEvent } from "../types/audit";
import type { DeviceRecord } from "../types/device";
import type { DomainEvent } from "../types/event";

describe("DeviceCheckInService", () => {
  it("creates a compliant device record", () => {
    const deviceRepository = createDeviceRepository();
    const auditRepository = createAuditRepository();
    const eventRepository = createEventStoreRepository();

    const service = new DeviceCheckInService(
      deviceRepository,
      auditRepository,
      eventRepository
    );

    const record = service.processDeviceCheckIn({
      deviceId: "macbook-001",
      platform: "macOS",
      diskEncrypted: true,
      antivirusRunning: true,
      lastPatchedDays: 2
    });

    expect(record.deviceId).toBe("macbook-001");
    expect(record.status).toBe("COMPLIANT");
    expect(record.violations).toHaveLength(0);

    expect(deviceRepository.records).toHaveLength(1);
    expect(auditRepository.records).toHaveLength(1);
    expect(eventRepository.records).toHaveLength(3);
  });

  it("creates a non-compliant device record with violations", () => {
    const deviceRepository = createDeviceRepository();
    const auditRepository = createAuditRepository();
    const eventRepository = createEventStoreRepository();

    const service = new DeviceCheckInService(
      deviceRepository,
      auditRepository,
      eventRepository
    );

    const record = service.processDeviceCheckIn({
      deviceId: "macbook-002",
      platform: "Windows",
      diskEncrypted: false,
      antivirusRunning: false,
      lastPatchedDays: 12
    });

    expect(record.status).toBe("NON_COMPLIANT");

    expect(record.violations).toEqual([
      {
        rule: "DISK_ENCRYPTION",
        severity: "HIGH"
      },
      {
        rule: "ANTIVIRUS",
        severity: "HIGH"
      },
      {
        rule: "PATCH_AGE",
        severity: "MEDIUM"
      }
    ]);

    expect(deviceRepository.records[0].deviceId).toBe("macbook-002");
    expect(auditRepository.records[0].status).toBe("NON_COMPLIANT");
    expect(auditRepository.records[0].violationCount).toBe(3);

    expect(eventRepository.records.map((event) => event.eventType)).toEqual([
      "DEVICE_CHECKED_IN",
      "COMPLIANCE_EVALUATED",
      "AUDIT_EVENT_CREATED"
    ]);
  });
});

function createDeviceRepository() {
  return {
    records: [] as DeviceRecord[],

    save(record: DeviceRecord): DeviceRecord {
      this.records.push(record);
      return record;
    },

    getAll(): DeviceRecord[] {
      return this.records;
    },

    getById(deviceId: string): DeviceRecord | undefined {
      return this.records.find((record) => record.deviceId === deviceId);
    }
  };
}

function createAuditRepository() {
  return {
    records: [] as AuditEvent[],

    save(event: AuditEvent): AuditEvent {
      this.records.push(event);
      return event;
    },

    getAll(): AuditEvent[] {
      return this.records;
    }
  };
}

function createEventStoreRepository() {
  return {
    records: [] as DomainEvent[],

    append(event: DomainEvent): DomainEvent {
      this.records.push(event);
      return event;
    },

    getAll(): DomainEvent[] {
      return this.records;
    },

    getEventsByAggregateId(aggregateId: string): DomainEvent[] {
      return this.records.filter((event) => event.aggregateId === aggregateId);
    }
  };
}