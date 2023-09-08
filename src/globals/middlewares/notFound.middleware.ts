import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../exceptions";

export default function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return next(new NotFoundException("route not found"));
}
