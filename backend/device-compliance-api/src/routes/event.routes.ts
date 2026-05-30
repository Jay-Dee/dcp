import { Router } from "express";

import {
  getAllEvents,
  getEventsByAggregateId
} from "../repositories/event.repository";

export const eventStoreRoutes = Router();

eventStoreRoutes.get("/", (_req, res) => {
  return res.status(200).json(getAllEvents());
});

eventStoreRoutes.get("/:aggregateId", (req, res) => {
  return res.status(200).json(getEventsByAggregateId(req.params.aggregateId));
});