import {
  DeviceCheckIn,
  ComplianceResult,
  ComplianceViolation
} from "../types/device.js";

export function evaluateCompliance(
  device: DeviceCheckIn
): ComplianceResult {

  const violations: ComplianceViolation[] = [];

  if (!device.diskEncrypted) {
    violations.push({
      rule: "DISK_ENCRYPTION",
      severity: "HIGH"
    });
  }

  if (!device.antivirusRunning) {
    violations.push({
      rule: "ANTIVIRUS",
      severity: "HIGH"
    });
  }

  if (device.lastPatchedDays > 7) {
    violations.push({
      rule: "PATCH_AGE",
      severity: "MEDIUM"
    });
  }

  return {
    deviceId: device.deviceId,
    status:
      violations.length === 0
        ? "COMPLIANT"
        : "NON_COMPLIANT",
    violations
  };
}