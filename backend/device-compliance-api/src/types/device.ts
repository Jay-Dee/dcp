export interface DeviceCheckIn {
  deviceId: string;
  platform: string;
  diskEncrypted: boolean;
  antivirusRunning: boolean;
  lastPatchedDays: number;
}

export interface ComplianceViolation {
  rule: string;
  severity: "HIGH" | "MEDIUM";
}

export interface ComplianceResult {
  deviceId: string;
  status: "COMPLIANT" | "NON_COMPLIANT";
  violations: ComplianceViolation[];
}