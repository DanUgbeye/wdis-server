import { Request, Response, NextFunction } from "express";
import ServerResponse from "../helpers/serverResponse";
import { NotFoundException } from "../exceptions";

export default function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  ServerResponse.create(res).error(new NotFoundException("route not found"));
}
