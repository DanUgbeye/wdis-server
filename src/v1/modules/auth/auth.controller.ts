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

  /** logs in a user */
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
}

const authController = new AuthController();

export default authController;
