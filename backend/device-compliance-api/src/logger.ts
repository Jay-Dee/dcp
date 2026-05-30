import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: [
    "req.headers.authorization",
    "password",
    "token"
  ],
  base: {
    service: "device-compliance-api",
    environment: process.env.NODE_ENV
  }
});