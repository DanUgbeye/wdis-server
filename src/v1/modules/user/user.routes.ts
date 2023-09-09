import express from "express";
import userController from "./user.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";

const userRouter = express.Router();

// get user data route
userRouter.get(
  "/:id",
  // validateRequest(userSignupSchema),
  authMiddleware.verifyAccessToken,
  userController.findById
);

// update password route
userRouter.patch(
  "/:id/change-password",
  // validateRequest(userSignupSchema),
  authMiddleware.verifyAccessToken,
  userController.changePassword
);

// update user route
userRouter.patch(
  "/:id",
  // validateRequest(userSignupSchema),
  authMiddleware.verifyAccessToken,
  userController.update
);

// update password route
userRouter.delete(
  "/:id",
  authMiddleware.verifyAccessToken,
  userController.deleteAccount
);

export default userRouter;
