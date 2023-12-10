import { UserRole } from "src/v1/modules/user/user.types";
import { TOKEN_TYPES } from "./token.constant";

export type TokenType = keyof typeof TOKEN_TYPES;

export type PayloadType = string | number | Object;

export type TokenPayload<T = PayloadType> = {
  data: T;
  type: TokenType;
};

export type TokenOptions = {
  expiresIn?: number;
};

export interface ITokenUtility<T> {
  create(payload: T, options?: TokenOptions): string;
  verify(token: string): T;
}

export interface AuthTokenPayload {
  _id: string;
  email: string;
  role: UserRole;
}
