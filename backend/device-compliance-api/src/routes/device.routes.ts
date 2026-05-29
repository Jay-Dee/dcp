import { Router } from "express";
import { evaluateCompliance } from "../services/compliance.service.js";
import { logger } from "../logger.js";

export const deviceRoutes = Router();

deviceRoutes.post("/checkin", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Request body is required"
    });
  }

  const result = evaluateCompliance(req.body);

  logger.info(
    {
      event: "device_compliance_evaluated",
      deviceId: result.deviceId,
      status: result.status,
      violationCount: result.violations.length
    },
    "Device compliance evaluated"
  );

  return res.status(200).json(result);
});
