// AppError.ts
export class AppError extends Error {
    constructor(message, statusCode = 500, meta) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.meta = meta;
        // Pour avoir un meilleur stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    // Méthode pour formater l'erreur de manière lisible
    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            ...(this.meta && { details: this.meta }),
        };
    }
    // Méthode pour logger de manière lisible
    toString() {
        let output = `${this.message} (${this.statusCode})`;
        if (this.meta?.errors) {
            output += '\nValidation errors:\n';
            this.meta.errors.forEach((err) => {
                output += `  - ${err.path}: ${err.message}\n`;
            });
        }
        return output;
    }
}
