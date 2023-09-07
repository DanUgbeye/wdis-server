import express from "express";
import authRouter from "./modules/auth/auth.routes";

const apiV1Routes = express.Router();

apiV1Routes.get("/", (req, res) => {
  res.send(`⚡ API V1 up and running ⚡`);
});

apiV1Routes.use("/auth", authRouter)

export default apiV1Routes;
