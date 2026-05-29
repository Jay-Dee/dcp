import { Router } from "express";

export const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "device-compliance-api",
    timestamp: new Date().toISOString()
  });
});