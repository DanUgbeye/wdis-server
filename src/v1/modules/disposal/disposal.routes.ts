import { Router } from "express";
import disposalController from "./disposal.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { RouterInterface } from "src/globals/types/router.types";
import { USER_ROLES } from "../user/user.types";

export default class DisposalRouter implements RouterInterface {
  private static instance: DisposalRouter | null = null;
  public router: Router;
  public BASE_PATH = "/disposal" as const;

  constructor() {
    if (DisposalRouter.instance) {
      throw new Error("Disposal Instance already exists");
    }

    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    // get all disposals route
    this.router.get(
      "/",
      authMiddleware.verifyAccessToken,
      disposalController.findById
    );

    // get disposal route
    this.router.get(
      "/stats",
      authMiddleware.verifyAccessToken,
      disposalController.getStats
    );

    // update disposal route
    this.router.patch(
      "/:id",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      disposalController.update
    );

    // delete disposal route
    this.router.delete(
      "/:id",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      disposalController.delete
    );
  }

  /** single instance of DisposalRouter */
  static bootstrap() {
    if (DisposalRouter.instance) {
      return DisposalRouter.instance;
    }

    DisposalRouter.instance = new DisposalRouter();
    return DisposalRouter.instance;
  }
}
