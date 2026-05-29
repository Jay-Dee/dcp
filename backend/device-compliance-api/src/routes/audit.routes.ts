import { Router } from "express";

import { getAllAuditEvents } from "../repositories/audit.repository.js";

export const auditRoutes = Router();

auditRoutes.get("/", (_req, res) => {
  return res.status(200).json(getAllAuditEvents());
});