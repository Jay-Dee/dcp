import { InMemoryAuditRepository } from "./repositories/inmemory-audit.repository";
import { InMemoryDeviceRepository } from "./repositories/inmemory-device.repository";
import { InMemoryEventRepository } from "./repositories/inmemory-event.repository";
import { DashboardSummaryService } from "./services/summary.service";

export const deviceRepository = new InMemoryDeviceRepository();
export const auditRepository = new InMemoryAuditRepository();
export const eventRepository = new InMemoryEventRepository();
export const dashboardSummaryService = new DashboardSummaryService(deviceRepository, auditRepository, eventRepository);