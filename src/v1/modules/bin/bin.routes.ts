import { Router } from "express";
import binController from "./bin.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { RouterInterface } from "src/globals/types/router.types";

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
    this.router.get("/", binController.findAll);

    // get all bins route
    this.router.post(
      "/",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole("admin"),
      binController.create
    );

    // get bin route
    this.router.get("/:id", binController.findById);

    // update bin route
    this.router.patch(
      "/:id",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole("admin"),
      binController.update
    );

    // delete bin route
    this.router.delete(
      "/:id",
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole("admin"),
      binController.delete
    );

    // update bin status route
    this.router.patch(
      "/:id/status/full",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole("admin"),
      binController.markAsFull
    );

    // update bin status route
    this.router.patch(
      "/:id/status/empty",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole("admin"),
      binController.markAsEmpty
    );

    // update bin status route
    this.router.patch(
      "/:id/status/ongoing",
      // validateRequest(),
      authMiddleware.verifyAccessToken,
      authMiddleware.requireRole("admin"),
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
