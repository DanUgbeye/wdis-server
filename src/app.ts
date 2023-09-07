import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import Helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import globalErrorMiddleware from "./globals/middlewares/error.middleware";
import notFoundMiddleware from "./globals/middlewares/notFound.middleware";
import ServerRoutes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(Helmet());
app.use(morgan("dev"));

// expose routes
app.use(ServerRoutes);

// add not found middleware
app.use(notFoundMiddleware);

// add error middleware
app.use(globalErrorMiddleware);

export default app;
