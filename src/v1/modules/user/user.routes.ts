import express from "express";
import userController from "./user.controller";
import authMiddleware from "../auth/auth.middleware";
import validateRequest from "../../../globals/middlewares/validator.middleware";

const userRouter = express.Router();

// update password route
userRouter.patch(
  "/change-password",
  // validateRequest(userSignupSchema),
  authMiddleware.requireAuth,
  userController.changePassword
);

// update password route
userRouter.delete(
  "/delete-account",
  authMiddleware.requireAuth,
  userController.deleteAccount
);

// get user data route
userRouter.get(
  "/:id",
  // validateRequest(userSignupSchema),
  authMiddleware.requireAuth,
  userController.findById
);

// update user route
userRouter.patch(
  "/:id",
  // validateRequest(userSignupSchema),
  authMiddleware.requireAuth,
  userController.update
);

export default userRouter;
