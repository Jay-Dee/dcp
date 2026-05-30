import { Router } from "express";
import { deviceRepository } from "../container";


import { deviceCheckInSchema } from "../schemas/device.schema";
import { deviceCheckInService } from "../services/device.service";

export const deviceRoutes = Router();

deviceRoutes.post("/checkin", (req, res) => {
  const validation = deviceCheckInSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid device check-in payload"
    });
  }

  const record = deviceCheckInService.processDeviceCheckIn(validation.data);

  return res.status(200).json(record);
});

deviceRoutes.get("/", (_req, res) => {
  return res.status(200).json(deviceRepository.getAll());
});

deviceRoutes.get("/:deviceId", (req, res) => {
  const record = deviceRepository.getById(req.params.deviceId);

  if (!record) {
    return res.status(404).json({
      error: "Device not found"
    });
  }

  return res.status(200).json(record);
});