import { Router } from "express";
import binController from "./bin.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { RouterInterface } from "src/globals/types/router.types";
import { USER_ROLES } from "../user/user.types";

export default class BinRouter implements RouterInterface {
  private static instance: BinRouter | null = null;
  public router: Router;
  public BASE_PATH = "/bin" as const;

  constructor() {
    if (BinRouter.instance) {
      throw new Error("Bin Instance already exists");
    }

    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    // get all bins route
    this.router.get(
      "/",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER, USER_ROLES.USER]),
      binController.findAll
    );

    // create bin route
    this.router.post(
      "/",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      binController.create
    );

    // get bin by id route
    this.router.get(
      "/:id",
      authMiddleware.verifyAccessToken,
      binController.findById
    );

    // update bin route
    this.router.patch(
      "/:id",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      binController.update
    );

    // delete bin route
    this.router.delete(
      "/:id",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      binController.delete
    );

    // mark bin status as full route
    this.router.patch(
      "/:id/status/full",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      binController.markAsFull
    );

    // mark bin status as empty route
    this.router.patch(
      "/:id/status/empty",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      binController.markAsEmpty
    );

    // mark bin status as full as ongoing route
    this.router.patch(
      "/:id/status/ongoing",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole([USER_ROLES.DISPOSER]),
      binController.markAsOngoing
    );

    // get all bin disposals
    this.router.get(
      "/:id/disposal",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      binController.findAllDisposalsForBin
    );
  }

  /** single instance of BinRouter */
  static bootstrap() {
    if (BinRouter.instance) {
      return BinRouter.instance;
    }

    BinRouter.instance = new BinRouter();
    return BinRouter.instance;
  }
}
