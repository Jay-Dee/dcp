import { Router } from "express";

import type { DashboardSummaryService } from "../services/summary.service";

export function createSummaryRoutes(
  dashboardSummaryService: DashboardSummaryService
): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    return res.status(200).json(dashboardSummaryService.getSummary());
  });

  return router;
}