import { Router } from "express";

import {
  getAllDeviceRecords,
  getDeviceRecord} from "../repositories/device.repository";
import { deviceCheckInSchema } from "../schemas/device.schema";
import { processDeviceCheckIn } from "../services/device.service";

export const deviceRoutes = Router();

deviceRoutes.post("/checkin", (req, res) => {
  const validation = deviceCheckInSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid device check-in payload"
    });
  }

  const record = processDeviceCheckIn(validation.data);

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