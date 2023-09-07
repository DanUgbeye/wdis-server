import BaseException from "./BaseException";

class NotFoundException extends BaseException {
  constructor(message: string = "requested resource not found") {
    super(message, 404);
    this.type = "NOT_FOUND_ERROR";
  }
}

export default NotFoundException;
