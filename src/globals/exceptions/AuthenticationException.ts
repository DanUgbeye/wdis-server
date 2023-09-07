import BaseException from "./BaseException";

class AuthenticationException extends BaseException {
  constructor(message: string = "authentication failed") {
    super(message, 401);
    this.type = "AUTHENTICATION_ERROR";
  }
}

export default AuthenticationException;
