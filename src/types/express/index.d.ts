import { UserDocument } from "../../v1/modules/user/user.types";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDocument;
    }
  }
}

export {};
