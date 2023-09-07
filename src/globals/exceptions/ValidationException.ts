import BaseException, { ErrorObject } from "./BaseException";

class ValidationException extends BaseException {
  protected errors: any;

  constructor(message: string = "something went wrong", errors?: any) {
    super(message, 422);
    this.type = "VALIDATION_ERROR";
    this.errors = errors || undefined;
  }

  getObject(): ErrorObject {
    return {
      code: this.code,
      message: this.message.toString(),
      type: this.type,
      errors: this.errors,
    };
  }
}

export default ValidationException;
