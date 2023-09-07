import BaseException from "./BaseException";

class AuthorizationException extends BaseException {
  constructor(message: string = "permission denied to this resource") {
    super(message, 403);
    this.type = "AUTHORIZATION_ERROR";
  }
}

export default AuthorizationException;
