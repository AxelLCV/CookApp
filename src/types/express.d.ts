import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      body?: any;
      params?: any;
      query?: any;
    };
    user?: {
      id: string;
      username?: string;
      roles?: string[];
    };
  }
}