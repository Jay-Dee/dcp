import { AuditEvent } from "../types/audit.js";

const auditEvents: AuditEvent[] = [];

export function saveAuditEvent(event: AuditEvent): AuditEvent {
  auditEvents.push(event);
  return event;
}

export function getAllAuditEvents(): AuditEvent[] {
  return auditEvents;
}