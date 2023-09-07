class BaseException extends Error {
  protected code: number;
  protected type: string;

  constructor(message: string, code: number = 400) {
    super(message);
    this.code = code;
    this.type = "ERROR";
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }

  getObject(): ErrorObject {
    return {
      code: this.code,
      message: this.message.toString(),
      type: this.type,
    };
  }
}

export default BaseException;

export type ErrorObject = {
  code: number;
  message: string;
  type: string;
  errors?: any;
};
