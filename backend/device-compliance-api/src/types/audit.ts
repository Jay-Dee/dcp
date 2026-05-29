export interface AuditEvent {
  auditId: string;
  timestamp: string;
  deviceId: string;
  action: "COMPLIANCE_EVALUATED";
  actor: "device-compliance-api";
  status: "COMPLIANT" | "NON_COMPLIANT";
  violationCount: number;
}