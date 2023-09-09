import jwt from "jsonwebtoken";
import {
  TOKEN_TYPES,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "./token.constant";
import {
  AuthTokenPayload,
  ITokenUtility,
  TokenOptions,
  TokenPayload,
} from "./token.types";
import { AuthenticationException } from "../../exceptions";

export class AccessTokenUtility implements ITokenUtility<AuthTokenPayload> {
  constructor(protected readonly secret: string) {}

  create(payload: AuthTokenPayload, options?: TokenOptions): string {
    const { expiresIn = ACCESS_TOKEN_EXPIRY } = options || {};
    const tokenPayload: TokenPayload<AuthTokenPayload> = {
      data: payload,
      type: TOKEN_TYPES.ACCESS_TOKEN,
    };

    return jwt.sign(tokenPayload, this.secret, {
      expiresIn,
    });
  }

  verify(token: string): AuthTokenPayload {
    try {
      const payload = jwt.verify(
        token,
        this.secret
      ) as TokenPayload<AuthTokenPayload>;

      if (payload.type !== TOKEN_TYPES.ACCESS_TOKEN) {
        throw new AuthenticationException("invalid token");
      }

      return payload.data;
    } catch (err: any | Error) {
      let errMessage = err.message
        ? (err.message as string).replaceAll("jwt", "token")
        : "authentication failed";
      throw new AuthenticationException(errMessage);
    }
  }
}

export class RefreshTokenUtility implements ITokenUtility<AuthTokenPayload> {
  constructor(protected readonly secret: string) {}

  create(payload: AuthTokenPayload, options?: TokenOptions): string {
    const { expiresIn = REFRESH_TOKEN_EXPIRY } = options || {};
    const tokenPayload: TokenPayload<AuthTokenPayload> = {
      data: payload,
      type: TOKEN_TYPES.ACCESS_TOKEN,
    };

    return jwt.sign(tokenPayload, this.secret, {
      expiresIn,
    });
  }

  verify(token: string): AuthTokenPayload {
    try {
      const payload = jwt.verify(
        token,
        this.secret
      ) as TokenPayload<AuthTokenPayload>;

      if (payload.type !== TOKEN_TYPES.ACCESS_TOKEN) {
        throw new AuthenticationException("invalid token");
      }

      return payload.data;
    } catch (err: any | Error) {
      let errMessage = err.message
        ? (err.message as string).replaceAll("jwt", "token")
        : "authentication failed";
      throw new AuthenticationException(errMessage);
    }
  }
}

export class VerifyEmailTokenUtility implements ITokenUtility<any> {
  create(payload: any, options?: TokenOptions | undefined): string {
    throw new Error("Method not implemented.");
  }

  verify(token: string) {
    throw new Error("Method not implemented.");
  }
}

export class ForgotPasswordTokenUtility implements ITokenUtility<any> {
  create(payload: any, options?: TokenOptions | undefined): string {
    throw new Error("Method not implemented.");
  }

  verify(token: string) {
    throw new Error("Method not implemented.");
  }
}

export class DeleteAccountTokenUtility implements ITokenUtility<any> {
  create(payload: any, options?: TokenOptions | undefined): string {
    throw new Error("Method not implemented.");
  }

  verify(token: string) {
    throw new Error("Method not implemented.");
  }
}
