export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly meta?: any;

  constructor(error: { code: string; status: number }, meta?: any) {
    super(error.code);
    this.code = error.code;
    this.statusCode = error.status;
    this.isOperational = true;
    this.meta = meta;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        statusCode: this.statusCode,
        ...(this.meta && { details: this.meta }),
      }
    };
  }

  toString() {
    let output = `[${this.code}] (${this.statusCode})`;

    if (this.meta?.errors) {
      output += '\nValidation errors:\n';
      this.meta.errors.forEach((err: any) => {
        output += `  - ${err.path}: ${err.message}\n`;
      });
    }

    return output;
  }
}