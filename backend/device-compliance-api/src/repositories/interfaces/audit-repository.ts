import type { AuditEvent } from "../../types/audit";

export interface AuditRepository {
  save(event: AuditEvent): AuditEvent;
  getAll(): AuditEvent[];
}