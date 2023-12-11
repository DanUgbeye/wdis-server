import { Router } from "express";
import appController from "./app.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { RouterInterface } from "src/globals/types/router.types";
import { USER_ROLES } from "../user/user.types";

export default class AppRouter implements RouterInterface {
  private static instance: AppRouter | null = null;
  public router: Router;
  public BASE_PATH = "/app" as const;

  constructor() {
    if (AppRouter.instance) {
      throw new Error("App Router Instance already exists");
    }

    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    // get all apps route
    this.router.get(
      "/stats",
      authMiddleware.authenticateUser,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      appController.getStats
    );
  }

  /** single instance of AppRouter */
  static bootstrap() {
    if (AppRouter.instance) {
      return AppRouter.instance;
    }

    AppRouter.instance = new AppRouter();
    return AppRouter.instance;
  }
}
