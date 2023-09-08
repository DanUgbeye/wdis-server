import {
  BadRequestException,
  BaseException,
  ServerException,
} from "../../../globals/exceptions";
import passwordUtility from "../../../globals/utils/password";
import { TUserLogin_RB, TUserSignup_RB } from "../auth/auth.types";
import userHelpers from "./user.helpers";
import userRepository from "./user.repository";

export class UserModel {
  async createUserFromCredentials(userData: TUserSignup_RB) {
    try {
      const userExists = await userRepository.findByEmail(userData.email);
      if (userExists) {
        throw new BadRequestException("email already exists");
      }

      const data = {
        ...userData,
        password: await passwordUtility.hash(userData.password),
      };

      let createdUser = await userRepository.create(data);
      return userHelpers.filter(createdUser);
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new ServerException(error.message);
    }
  }

  async login(userData: TUserLogin_RB) {
    try {
      const user = await userRepository.findByEmail(userData.email);
      if (!user) {
        throw new BadRequestException("incorrect credentials");
      }

      if (!user.password) {
        throw new BadRequestException("incorrect login method selected");
      }

      let passwordMatch = await passwordUtility.compare(
        userData.password,
        user.password
      );

      if (!passwordMatch) {
        throw new BadRequestException("incorrect credentials");
      }

      return userHelpers.filter(user);
    } catch (error: Error | BaseException | any) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new ServerException(error.message);
    }
  }
}

const userModel = new UserModel();

export default userModel;
