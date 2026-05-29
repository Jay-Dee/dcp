import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./logger.js";
import { healthRoutes } from "./routes/healthcheck.routes.js";
import { deviceRoutes } from "./routes/device.routes.js";
import { auditRoutes } from "./routes/audit.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/health", healthRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/audit", auditRoutes);

app.listen(PORT, () => {
  logger.info(
    {
      port: PORT
    },
    "API server started"
  );
});