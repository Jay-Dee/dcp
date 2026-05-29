import { Router } from "express";

import { logger } from "../logger.js";
import { saveDeviceRecord, getAllDeviceRecords, getDeviceRecord } from "../repositories/device.repository.js";
import { evaluateCompliance } from "../services/compliance.service.js";
import { DeviceCheckIn, DeviceRecord } from "../types/device.js";

export const deviceRoutes = Router();

deviceRoutes.post("/checkin", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Request body is required"
    });
  }

  const checkIn = req.body as DeviceCheckIn;
  const result = evaluateCompliance(checkIn);

  const record: DeviceRecord = {
    ...checkIn,
    status: result.status,
    violations: result.violations,
    checkedInAt: new Date().toISOString()
  };

  saveDeviceRecord(record);

  logger.info(
    {
      event: "device_record_saved",
      deviceId: record.deviceId,
      platform: record.platform,
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