import express, { Router } from "express";
import userController from "./user.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { RouterInterface } from "src/globals/types/router.types";
import { USER_ROLES } from "./user.types";

export default class UserRouter implements RouterInterface {
  static instance: UserRouter | null = null;
  public router: Router;
  public BASE_PATH = "/user" as const;

  constructor() {
    if (UserRouter.instance) {
      throw new Error("Bin Instance already exists");
    }

    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    // get user data route
    this.router.get(
      "/profile",
      authMiddleware.verifyAccessToken,
      userController.getProfile
    );

    // get user data route
    this.router.get(
      "/:id",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      userController.findById
    );

    // update password route
    this.router.patch(
      "/:id/change-password",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      userController.changePassword
    );

    // update user route
    this.router.patch(
      "/:id",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      userController.update
    );

    // update password route
    this.router.delete(
      "/:id",
      authMiddleware.verifyAccessToken,
      userController.deleteAccount
    );
  }

  /** single instance of UserRouter */
  static bootstrap() {
    if (UserRouter.instance) {
      return UserRouter.instance;
    }

    UserRouter.instance = new UserRouter();
    return UserRouter.instance;
  }
}
