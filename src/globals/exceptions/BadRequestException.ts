import BaseException from "./BaseException";

class BadRequestException extends BaseException {
  constructor(message: string = "a problem occured with the request") {
    super(message);
    this.type = "BAD_REQUEST_ERROR";
  }
}

export default BadRequestException;
