import { Request, Response } from "express";
import ServerResponse from "../../../globals/helpers/serverResponse";

export class UserController {
  /** get user profile data */
  async findById(req: Request<any, any, any, any>, res: Response) {
    return ServerResponse.create(res).success("get profile");
  }

  /** update user data */
  async update(req: Request<any, any, any, any>, res: Response) {
    return ServerResponse.create(res).success("update profile");
  }

  /** change password */
  async changePassword(req: Request<any, any, any, any>, res: Response) {
    return ServerResponse.create(res).success("change password");
  }

  /**deletes a user account */
  async deleteAccount(req: Request<any, any, any, any>, res: Response) {
    return ServerResponse.create(res).success("delete user account");
  }
}

const userController = new UserController();

export default userController;
