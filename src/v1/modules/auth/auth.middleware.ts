import { NextFunction, Request, Response } from "express";
import { AuthenticationException } from "../../../globals/exceptions";
import { authToken } from "../../../globals/utils/token";
import { AuthTokenPayload } from "../../../globals/utils/token/token.types";
import { UserDocument } from "../user/user.types";
import userRepository from "../user/user.repository";
import { AppPermissions } from "../permissions/permission.types";

export class AuthMiddleware {
  async authenticateUser() {}

  async requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AuthenticationException("auth token not found"));
    }

    let token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AuthenticationException("invalid auth token"));
    }

    let payload: AuthTokenPayload;
    try {
      payload = authToken.verify(token);
    } catch (error: any) {
      return next(new AuthenticationException("invalid auth token"));
    }

    let user: UserDocument | null;
    try {
      user = await userRepository.findById(payload._id);
      if (!user) {
        throw new AuthenticationException("user not found");
      }
    } catch (error: any) {
      return next(new AuthenticationException("invalid auth token"));
    }

    req.user = user;
    next();
  }

  async requirePermission(permission: AppPermissions) {}

  async requireRole(role: string) {}
}

const authMiddleware = new AuthMiddleware();

export default authMiddleware;
