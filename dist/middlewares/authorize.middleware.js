export const authorize = (options) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.id)
            return res.status(401).json({ message: "Unauthorized" });
        //Role-based authorization
        if (options.allowedRoles && options.allowedRoles.includes(req.user.role || ""))
            return next();
        //Ownership-based authorization
        if (options.model && options.ownerField && options.idParam) {
            const resourceId = req.params[options.idParam];
            if (!resourceId)
                return res.status(400).json({ message: "Resource ID missing" });
            const resource = await options.model.findUnique({
                where: { id: resourceId },
            });
            if (resource && resource[options.ownerField] === req.user.id)
                return next();
        }
        ;
        return res.status(403).json({ message: "Forbidden" });
    };
};
