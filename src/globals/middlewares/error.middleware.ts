import { NextFunction, Request, Response } from "express";
import BaseException from "../exceptions/BaseException";
import ApiResponse from "../helpers/apiResponse";
import { ServerException } from "../exceptions";

export default async function globalErrorMHandler(
  err: BaseException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.error(err);
  const error =
    err instanceof BaseException ? err : new ServerException(err.message);
  ApiResponse.create(res).error(error);
}
