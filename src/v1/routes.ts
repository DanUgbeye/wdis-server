import express from "express";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";

const apiV1Routes = express.Router();

apiV1Routes.get("/", (req, res) => {
  res.send(`⚡ API V1 up and running ⚡`);
});

apiV1Routes.use("/auth", authRouter);
apiV1Routes.use("/user", userRouter);

export default apiV1Routes;
