export const logger = (req, res, next) => {
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
            role: req.user?.role,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        };
        console.log(JSON.stringify(log));
    });
    next();
};
