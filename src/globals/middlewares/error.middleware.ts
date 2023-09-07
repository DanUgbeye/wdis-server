import { NextFunction, Request, Response } from "express";
import BaseException from "../exceptions/BaseException";
import ServerResponse from "../helpers/serverResponse";
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
  ServerResponse.create(res).error(error);
}
