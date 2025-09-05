import "server-only";

import pino from "pino";
import { pinoLoki } from "pino-loki";
import { envServer } from "@/lib/env/env.server";

// noinspection BadExpressionStatementJS: workaround to prevent webpack's tree-shaking
typeof pinoLoki;

const createTransports = () => {
  const targets = [];
  if (envServer.LOKI_URL) {
    targets.push({
      target: "pino-loki",
      level: envServer.LOG_LEVEL,
      options: {
        batching: true,
        interval: 5,
        host: envServer.LOKI_URL,
        labels: {
          app: envServer.LOKI_APP_NAME ?? "next-app",
          environment: process.env.NODE_ENV,
        },
      },
    });
  }

  if (process.env.NODE_ENV === "development") {
    targets.push({
      target: "pino-pretty",
      level: envServer.LOG_LEVEL,
      options: {},
    });
  }

  return pino.transport({
    targets,
  });
};

export const serverLogger = pino(
  {
    base: {
      runtime: process.env.NODE_ENV,
      pid: process.pid,
    },
  },
  createTransports(),
);
