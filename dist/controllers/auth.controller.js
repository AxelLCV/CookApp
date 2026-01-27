import { AuthService } from "../services/auth.service.js";
export const authController = {
    // -----------------------------
    // REGISTER
    // -----------------------------
    register: async (req, res, next) => {
        try {
            const input = req.validated.body; // validé par validateRequest
            const result = await AuthService.register(input);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error); // AppError sera géré par errorHandler.middleware
        }
    },
    // -----------------------------
    // LOGIN
    // -----------------------------
    login: async (req, res, next) => {
        try {
            const input = req.validated.body; // validé par validateRequest
            const result = await AuthService.login(input);
            return res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
