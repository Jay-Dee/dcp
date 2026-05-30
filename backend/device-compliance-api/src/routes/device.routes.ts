import crypto from "node:crypto";
import { Router } from "express";

import { logger } from "../logger";
import { saveAuditEvent } from "../repositories/audit.repository";
import {
  getAllDeviceRecords,
  getDeviceRecord,
  saveDeviceRecord
} from "../repositories/device.repository";
import { appendEvent } from "../repositories/event.repository";
import { deviceCheckInSchema } from "../schemas/device.schema";
import { evaluateCompliance } from "../services/compliance.service";
import type { DeviceRecord } from "../types/device";

export const deviceRoutes = Router();

deviceRoutes.post("/checkin", (req, res) => {
  const validation = deviceCheckInSchema.safeParse(req.body);

  if (!validation.success) {
    logger.warn(
      {
        event: "device_checkin_validation_failed",
        issues: validation.error.issues
      },
      "Invalid device check-in payload"
    );

    return res.status(400).json({
      error: "Invalid device check-in payload",
      details: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  const checkIn = validation.data;
  const checkedInAt = new Date().toISOString();

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "DEVICE_CHECKED_IN",
    aggregateId: checkIn.deviceId,
    aggregateType: "DEVICE",
    timestamp: checkedInAt,
    payload: checkIn
  });

  const result = evaluateCompliance(checkIn);

  const record: DeviceRecord = {
    ...checkIn,
    status: result.status,
    violations: result.violations,
    checkedInAt
  };

  saveDeviceRecord(record);

  const auditEvent = saveAuditEvent({
    auditId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    deviceId: record.deviceId,
    action: "COMPLIANCE_EVALUATED",
    actor: "device-compliance-api",
    status: record.status,
    violationCount: record.violations.length
  });

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "COMPLIANCE_EVALUATED",
    aggregateId: record.deviceId,
    aggregateType: "DEVICE",
    timestamp: new Date().toISOString(),
    payload: {
      status: result.status,
      violations: result.violations,
      violationCount: result.violations.length
    }
  });

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "AUDIT_EVENT_CREATED",
    aggregateId: auditEvent.auditId,
    aggregateType: "AUDIT",
    timestamp: auditEvent.timestamp,
    payload: auditEvent as unknown as Record<string, unknown>
  });

  logger.info(
    {
      event: "device_record_saved",
      deviceId: record.deviceId,
      status: record.status,
      violationCount: record.violations.length
    },
    "Device record saved"
  );

  return res.status(200).json(record);
});

deviceRoutes.get("/", (_req, res) => {
  return res.status(200).json(getAllDeviceRecords());
});

deviceRoutes.get("/:deviceId", (req, res) => {
  const record = getDeviceRecord(req.params.deviceId);

  if (!record) {
    return res.status(404).json({
      error: "Device not found"
    });
  }

  return res.status(200).json(record);
});