import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";

export const authorize = (options: {
  allowedRoles?: string[];
  model?: any;
  ownerField?: string;
  idParam?: string;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) throw new AppError(ErrorCodes.UNAUTHORIZED);
    //Role-based authorization
    if (options.allowedRoles && req.user?.roles?.some((r: string) => options.allowedRoles!.includes(r))) return next();
    //Ownership-based authorization
    if (options.model && options.ownerField && options.idParam) {
        const resourceId = req.params[options.idParam];
        if (!resourceId) throw new AppError(ErrorCodes.RESOURCE_ID_MISSING);
        const resource = await options.model.findUnique({
            where: {
              [options.idParam]: resourceId,              
            },
        });
        if(resource && resource[options.ownerField] === req.user.id) return next();
    };
    throw new AppError(ErrorCodes.FORBIDDEN);
  };
};
