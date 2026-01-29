import { Request, Response, NextFunction } from "express";

export const authorize = (options: {
  allowedRoles?: string[];
  model?: any;
  ownerField?: string;
  idParam?: string;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });
    //Role-based authorization
    if (options.allowedRoles && req.user?.roles?.some((r: string) => options.allowedRoles!.includes(r))) return next();
    //Ownership-based authorization
    if (options.model && options.ownerField && options.idParam) {
        const resourceId = req.params[options.idParam];
        if (!resourceId) return res.status(400).json({ message: "Resource ID missing" });
        const resource = await options.model.findFirst({
            where: {
              OR: [
                { id: resourceId },
                { slug: resourceId },
              ],
            },
        });
        if(resource && resource[options.ownerField] === req.user.id) return next();
    };
    return res.status(403).json({ message: "Forbidden" });
  };
};
