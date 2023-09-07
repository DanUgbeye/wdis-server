import { NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions";
import { RequestValidationSchemas } from "../../types/validation.types";

export default function validateRequest(schemas: RequestValidationSchemas) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (schemas.body) {
        let body = await schemas.body.parseAsync(req.body);
        req.body = body;
      }

      if (schemas.params) {
        let params = await schemas.params.parseAsync(req.params);
        req.params = params;
      }

      if (schemas.query) {
        let query = await schemas.query.parseAsync(req.query);
        req.query = query;
      }
    } catch (error: any) {
      console.log(error);
      let errMessage: string = "validation failed";
      next(new ValidationException(errMessage));
    }
  };
}
