import { Request, Response } from "express";
import { TUserLogin_RB, TUserSignup_RB } from "./auth.types";
import ApiResponse from "../../../globals/helpers/apiResponse";
import { UserDocument } from "../user/user.types";
import userModel from "../user/user.model";
import { BaseException } from "../../../globals/exceptions";
import { accessTokenUtility } from "../../../globals/utils/token";
import { ACCESS_TOKEN_EXPIRY } from "../../../globals/utils/token/token.constant";

export class AuthController {
  /** creates a new user */
  async signup(req: Request<any, any, TUserSignup_RB, any>, res: Response) {
    let createdUser: UserDocument;

    try {
      createdUser = await userModel.createUserFromCredentials(req.body);
    } catch (error: any) {
      return ApiResponse.create(res).error(error);
    }

    const token = accessTokenUtility.create({
      _id: createdUser._id,
      email: createdUser.email,
      role: createdUser.role || "user",
    });

    const response = {
      user: createdUser,
      auth: { token, expiresIn: ACCESS_TOKEN_EXPIRY },
    };
    return ApiResponse.create(res).success("signup successful", response);
  }

  /** login an admin */
  async adminLogin(req: Request<any, any, TUserLogin_RB, any>, res: Response) {
    let user: UserDocument;
    try {
      user = await userModel.adminLogin(req.body);
    } catch (error: BaseException | Error | any) {
      return ApiResponse.create(res).error(error);
    }

    const token = accessTokenUtility.create({
      _id: user._id,
      email: user.email,
      role: user.role || "admin",
    });
    const response = {
      user,
      auth: { token, expiresIn: ACCESS_TOKEN_EXPIRY },
    };
    return ApiResponse.create(res).success("login successful", response);
  }

  /** login a user */
  async login(req: Request<any, any, TUserLogin_RB, any>, res: Response) {
    let user: UserDocument;
    try {
      user = await userModel.login(req.body);
    } catch (error: BaseException | Error | any) {
      return ApiResponse.create(res).error(error);
    }

    const token = accessTokenUtility.create({
      _id: user._id,
      email: user.email,
      role: user.role || "user",
    });
    const response = {
      user,
      auth: { token, expiresIn: ACCESS_TOKEN_EXPIRY },
    };
    return ApiResponse.create(res).success("login successful", response);
  }

  /** sign in with google a user */
  async signInWithGoogle(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("google sign in");
  }

  /** generates new access token for user */
  async refreshAccessToken(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("google sign in");
  }

  /** resends account verificatiion mail */
  async resendAccountVerificationMail(
    req: Request<any, any, any, any>,
    res: Response
  ) {
    return ApiResponse.create(res).success("resend verification mail");
  }

  /** verify a user account */
  async verifyAccount(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("verify account");
  }

  /** send forgot password mail */
  async sendForgotPasswordMail(
    req: Request<any, any, any, any>,
    res: Response
  ) {
    return ApiResponse.create(res).success("forgot password email");
  }

  /** change password using token */
  async changePasswordWithToken(
    req: Request<any, any, any, any>,
    res: Response
  ) {
    return ApiResponse.create(res).success("change password with token");
  }

  /** change password */
  async changePassword(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("change password");
  }

  /**deletes a user account */
  async deleteAccount(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("delete user account");
  }
}

const authController = new AuthController();

export default authController;
