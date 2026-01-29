import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 500
        ? "error"
        : res.statusCode >= 400
        ? "warn"
        : "info",

      message: "HTTP request",

      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,

      userId: req.user?.id,
      roles: req.user?.roles,

      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };

    console.log(JSON.stringify(log));
  });
    next();
}; 