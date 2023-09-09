import { NextFunction, Request, Response } from "express";
import { AuthenticationException } from "../../../globals/exceptions";
import { accessTokenUtility } from "../../../globals/utils/token";
import { AuthTokenPayload } from "../../../globals/utils/token/token.types";
import { UserDocument } from "../user/user.types";
import userRepository from "../user/user.repository";
import { AppPermissions } from "../permissions/permission.types";

export class AuthMiddleware {
  async authenticateUser() {}

  async verifyAccessToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AuthenticationException("access token not found"));
    }

    let token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AuthenticationException("invalid access token"));
    }

    let payload: AuthTokenPayload;
    try {
      payload = accessTokenUtility.verify(token);
    } catch (error: any) {
      return next(new AuthenticationException("invalid access token"));
    }

    let user: UserDocument | null;
    try {
      user = await userRepository.findById(payload._id);
      if (!user) {
        throw new AuthenticationException("user not found");
      }
    } catch (error: any) {
      return next(new AuthenticationException("invalid access token"));
    }

    req.user = user;
    next();
  }

  async verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers["refresh-token"];

    if (typeof refreshToken !== "string") {
      return next(new AuthenticationException("refresh token not found"));
    }

    if (!refreshToken) {
      return next(new AuthenticationException("invalid refresh token"));
    }

    let payload: AuthTokenPayload;
    try {
      payload = accessTokenUtility.verify(refreshToken);
    } catch (error: any) {
      return next(new AuthenticationException("invalid refresh token"));
    }

    let user: UserDocument | null;
    try {
      user = await userRepository.findById(payload._id);
      if (!user) {
        throw new AuthenticationException("user not found");
      }
    } catch (error: any) {
      return next(new AuthenticationException("invalid refresh token"));
    }

    req.user = user;
    next();
  }

  async requirePermission(permission: AppPermissions) {}

  async requireRole(role: string) {}
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;
