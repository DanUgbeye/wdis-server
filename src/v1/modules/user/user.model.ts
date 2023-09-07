import {
  BadRequestException,
  BaseException,
  ServerException,
} from "../../../globals/exceptions";
import passwordUtility from "../../../globals/utils/password";
import { TUserLogin, TUserSignup } from "../auth/auth.types";
import userRepository from "./user.repository";

export class UserModel {
  async createUserFromCredentials(userData: TUserSignup) {
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
      delete createdUser.password;
      return createdUser;
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new ServerException(error.message);
    }
  }

  async login(userData: TUserLogin) {
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

      delete user.password;
      return user;
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
