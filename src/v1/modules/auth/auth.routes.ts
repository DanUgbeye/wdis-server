import { Router } from "express";
import { userLoginSchema, userSignupSchema } from "./auth.validation";
import authController from "./auth.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { RouterInterface } from "src/globals/types/router.types";

export default class AuthRouter implements RouterInterface {
  private static instance: AuthRouter | null = null;
  public router: Router;
  public BASE_PATH = "/auth" as const;

  constructor() {
    if (AuthRouter.instance) {
      throw new Error("Auth Instance already exists");
    }

    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    // login route
    this.router.post(
      "/login",
      validateRequest(userLoginSchema),
      authController.login
    );

    // disposer login route
    this.router.post(
      "/disposer/login",
      validateRequest(userLoginSchema),
      authController.disposerLogin
    );

    // signup route
    this.router.post(
      "/signup",
      validateRequest(userSignupSchema),
      authController.signup
    );

    // signup with google route
    this.router.get(
      "/signup/google",
      // passport JS setup,
      authController.signInWithGoogle
    );

    // generates a new access token
    this.router.get(
      "refresh-token",
      authMiddleware.verifyRefreshToken,
      authController.refreshAccessToken
    );

    // resend account verification email route
    this.router.post(
      "/verify-email/resend",
      // validateRequest(userSignupSchema),
      authController.resendAccountVerificationMail
    );

    // verify email route
    this.router.get("/verify-email/:token", authController.verifyAccount);

    // request forgot password email route
    this.router.post(
      "/forgot-password",
      // validateRequest(userSignupSchema),
      authController.sendForgotPasswordMail
    );

    // change password route
    this.router.post(
      "/forgot-password/:token",
      // validateRequest(userSignupSchema),
      authController.changePasswordWithToken
    );
  }

  /** single instance of AuthRouter */
  static bootstrap() {
    if (AuthRouter.instance) {
      return AuthRouter.instance;
    }

    AuthRouter.instance = new AuthRouter();
    return AuthRouter.instance;
  }
}
