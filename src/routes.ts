import express from "express";
import apiV1Routes from "./v1/routes";

const ServerRoutes = express.Router();

ServerRoutes.get("/", (req, res) => {
  res.send(`⚡ API up and running ⚡`);
});

ServerRoutes.use("/v1", apiV1Routes);

export default ServerRoutes;
