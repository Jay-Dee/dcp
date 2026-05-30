export interface ComplianceViolation {
  rule: string;
  severity: "HIGH" | "MEDIUM";
}

export interface DeviceRecord {
  deviceId: string;
  platform: string;
  diskEncrypted: boolean;
  antivirusRunning: boolean;
  lastPatchedDays: number;
  status: "COMPLIANT" | "NON_COMPLIANT";
  violations: ComplianceViolation[];
  checkedInAt: string;
}

export interface AuditEvent {
  auditId: string;
  timestamp: string;
  deviceId: string;
  action: string;
  actor: string;
  status: "COMPLIANT" | "NON_COMPLIANT";
  violationCount: number;
}

export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: string;
  payload: Record<string, unknown>;
}