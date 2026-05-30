export type DomainEventType =
  | "DEVICE_CHECKED_IN"
  | "COMPLIANCE_EVALUATED"
  | "AUDIT_EVENT_CREATED";

export interface DomainEvent {
  eventId: string;
  eventType: DomainEventType;
  aggregateId: string;
  aggregateType: "DEVICE" | "AUDIT";
  timestamp: string;
  payload: Record<string, unknown>;
}