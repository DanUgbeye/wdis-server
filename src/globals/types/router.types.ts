import { Router } from "express";

export interface RouterInterface {
  BASE_PATH: string;
  router: Router;
  registerRoutes(): void;
}
