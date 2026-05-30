import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";

import { logger } from "./logger.js";
import { auditRoutes } from "./routes/audit.routes.js";
import { deviceRoutes } from "./routes/device.routes.js";
import { eventStoreRoutes } from "./routes/event.routes.js";
import { healthRoutes } from "./routes/healthcheck.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/health", healthRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/events", eventStoreRoutes);

app.listen(PORT, () => {
  logger.info(
    {
      event: "server_started",
      port: PORT
    },
    "API server started"
  );
});