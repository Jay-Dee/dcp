import { Router } from "express";
import { auditRepository } from "../container";

export const auditRoutes = Router();

auditRoutes.get("/", (_req, res) => {
  return res.status(200).json(auditRepository.getAll());
});