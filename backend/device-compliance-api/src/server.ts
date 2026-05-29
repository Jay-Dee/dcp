import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(pinoHttp({ logger }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "device-compliance-api",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  logger.info(
    {
      port: PORT
    },
    "API server started"
  );
});