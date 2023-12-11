import express from "express";
import AuthRouter from "./modules/auth/auth.routes";
import UserRouter from "./modules/user/user.routes";
import BinRouter from "./modules/bin/bin.routes";
import { RouterInterface } from "src/globals/types/router.types";
import AppRouter from "./modules/app/app.routes";
import DisposalRouter from "./modules/disposal/disposal.routes";

const apiV1Routes = express.Router();
const authRouter: RouterInterface = AuthRouter.bootstrap();
const appRouter: RouterInterface = AppRouter.bootstrap();
const userRouter: RouterInterface = UserRouter.bootstrap();
const binRouter: RouterInterface = BinRouter.bootstrap();
const disposalRouter: RouterInterface = DisposalRouter.bootstrap();

apiV1Routes.get("/", (req, res) => {
  res.send(`⚡ API V1 up and running ⚡`);
});

// register auth routes
apiV1Routes.use(authRouter.BASE_PATH, authRouter.router);

// register app routes
apiV1Routes.use(appRouter.BASE_PATH, appRouter.router);

// register user routes
apiV1Routes.use(userRouter.BASE_PATH, userRouter.router);

// register bin routes
apiV1Routes.use(binRouter.BASE_PATH, binRouter.router);

// register disposal routes
apiV1Routes.use(disposalRouter.BASE_PATH, disposalRouter.router);

export default apiV1Routes;
