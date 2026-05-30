import type { AuditRepository } from "../repositories/interfaces/audit-repository";
import type { DeviceRepository } from "../repositories/interfaces/device-repository";
import type { EventStoreRepository } from "../repositories/interfaces/event-repository";

export interface DashboardSummary {
  totalDevices: number;
  compliantDevices: number;
  nonCompliantDevices: number;
  highRiskDevices: number;
  auditEvents: number;
  domainEvents: number;
}

export class DashboardSummaryService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly auditRepository: AuditRepository,
    private readonly eventStoreRepository: EventStoreRepository
  ) {}

  getSummary(): DashboardSummary {
    const devices = this.deviceRepository.getAll();
    const auditEvents = this.auditRepository.getAll();
    const domainEvents = this.eventStoreRepository.getAll();

    return {
      totalDevices: devices.length,
      compliantDevices: devices.filter((device) => device.status === "COMPLIANT").length,
      nonCompliantDevices: devices.filter((device) => device.status === "NON_COMPLIANT").length,
      highRiskDevices: devices.filter((device) =>
        device.violations.some((violation) => violation.severity === "HIGH")
      ).length,
      auditEvents: auditEvents.length,
      domainEvents: domainEvents.length
    };
  }
}