import { Request, Response } from "express";
import { TUserLogin_RB, TUserSignup_RB } from "./auth.types";
import ServerResponse from "../../../globals/helpers/serverResponse";
import { UserDocument } from "../user/user.types";
import userModel from "../user/user.model";
import { BaseException } from "../../../globals/exceptions";
import { authToken } from "../../../globals/utils/token";
import { _1_WEEK } from "../../../globals/utils/token/token.constant";

export class AuthController {
  /** creates a new user */
  async signup(req: Request<any, any, TUserSignup_RB, any>, res: Response) {
    let createdUser: UserDocument;

    try {
      createdUser = await userModel.createUserFromCredentials(req.body);
    } catch (error: any) {
      return ServerResponse.create(res).error(error);
    }

    const token = authToken.create({
      _id: createdUser._id,
      email: createdUser.email,
    });

    const response = {
      user: createdUser,
      auth: { token, expiresIn: _1_WEEK },
    };
    return ServerResponse.create(res).success("signup successful", response);
  }

  /** login a user */
  async login(req: Request<any, any, TUserLogin_RB, any>, res: Response) {
    let user: UserDocument;
    try {
      user = await userModel.login(req.body);
    } catch (error: BaseException | Error | any) {
      return ServerResponse.create(res).error(error);
    }

    const token = authToken.create({ _id: user._id, email: user.email });
    const response = {
      user,
      auth: { token, expiresIn: _1_WEEK },
    };
    return ServerResponse.create(res).success("login successful", response);
  }

  /** sign in with google a user */
  async signInWithGoogle(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("google sign in");
  }

  /** resends account verificatiion mail */
  async resendAccountVerificationMail(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("resend verification mail");
  }

  /** verify a user account */
  async verifyAccount(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("verify account");
  }

  /** send forgot password mail */
  async sendForgotPasswordMail(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("forgot password email");
  }

  /** change password using token */
  async changePasswordWithToken(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("change password with token");
  }

  /** change password */
  async changePassword(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("change password");
  }

  /**deletes a user account */
  async deleteAccount(
    req: Request<any, any, TUserLogin_RB, any>,
    res: Response
  ) {
    return ServerResponse.create(res).success("delete user account");
  }
}

const authController = new AuthController();

export default authController;
