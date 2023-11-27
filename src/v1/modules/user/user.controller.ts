import { Request, Response } from "express";
import ApiResponse from "../../../globals/helpers/apiResponse";
import userRepository from "./user.repository";
import { BadRequestException } from "../../../globals/exceptions";
import userHelpers from "./user.helpers";

export class UserController {
  /** get user profile data */
  async findById(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("get profile");
  }

  /** get user profile data */
  async getProfile(req: Request<any, any, any, any>, res: Response) {
    const userId = req.user._id as string;

    try {
      const data = await userRepository.findById(userId);
      if (!data) {
        throw new BadRequestException("profile not found");
      }

      const user = userHelpers.filter(data);

      return ApiResponse.create(res).success("get profile", user);
    } catch (err: any) {
      return ApiResponse.create(res).error(err);
    }
  }

  /** update user data */
  async update(req: Request<any, any, any, any>, res: Response) {
    return ApiResponse.create(res).success("update profile");
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

const userController = new UserController();

export default userController;
