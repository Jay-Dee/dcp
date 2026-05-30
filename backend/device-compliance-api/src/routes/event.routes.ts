import { Router } from "express";
import { eventRepository } from "../container";

export const eventStoreRoutes = Router();

eventStoreRoutes.get("/", (_req, res) => {
  return res.status(200).json(eventRepository.getAll());
});

eventStoreRoutes.get("/:aggregateId", (req, res) => {
  return res.status(200).json(eventRepository.getEventsByAggregateId(req.params.aggregateId));
});