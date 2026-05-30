import { AuditEvent } from "../types/audit.js";
import { AuditRepository } from "./interfaces/audit-repository.js";

export class InMemoryAuditRepository  implements AuditRepository {
   private readonly auditEvents: AuditEvent[] = [];

  getAll(): AuditEvent[] {
    return this.auditEvents;
  }
  save(event: AuditEvent): AuditEvent {
    this.auditEvents.push(event);
    return event;
  }
}
