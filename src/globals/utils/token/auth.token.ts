import jwt from "jsonwebtoken";
import { TOKEN_TYPES, _1_WEEK } from "./token.constant";
import {
  AuthTokenPayload,
  IToken,
  TokenOptions,
  TokenPayload,
} from "./token.types";
import { AuthenticationException } from "../../exceptions";

export class AuthToken implements IToken<AuthTokenPayload> {
  constructor(protected readonly secret: string) {}

  create(payload: AuthTokenPayload, options?: TokenOptions): string {
    const { expiresIn = _1_WEEK } = options || {};
    const tokenPayload: TokenPayload<AuthTokenPayload> = {
      data: payload,
      type: TOKEN_TYPES.USER_AUTH,
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

      if (payload.type !== TOKEN_TYPES.USER_AUTH) {
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
