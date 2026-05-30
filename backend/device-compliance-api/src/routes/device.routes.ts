import { Router } from "express";
import crypto from "node:crypto";

import { logger } from "../logger.js";
import { saveDeviceRecord, getAllDeviceRecords, getDeviceRecord } from "../repositories/device.repository.js";
import { evaluateCompliance } from "../services/compliance.service.js";
import { DeviceCheckIn, DeviceRecord } from "../types/device.js";
import { saveAuditEvent } from "../repositories/audit.repository.js";
import { appendEvent } from "../repositories/event.repository";

export const deviceRoutes = Router();

deviceRoutes.post("/checkin", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Request body is required"
    });
  }

  const checkedInAt = new Date().toISOString();
  const checkIn = req.body as DeviceCheckIn;

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "DEVICE_CHECKED_IN",
    aggregateId: checkIn.deviceId,
    aggregateType: "DEVICE",
    timestamp: checkedInAt,
    payload: checkIn as unknown as Record<string, unknown>
  });

  const result = evaluateCompliance(checkIn);

  appendEvent({
    eventId: crypto.randomUUID(),
    eventType: "COMPLIANCE_EVALUATED",
    aggregateId: checkIn.deviceId,
    aggregateType: "DEVICE",
    timestamp: new Date().toISOString(),
    payload: {
      status: result.status,
      violations: result.violations,
      violationCount: result.violations.length
    }
  });

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
    return res.status(404).json({ error: "Device not found" });
  }

  return res.status(200).json(record);
});