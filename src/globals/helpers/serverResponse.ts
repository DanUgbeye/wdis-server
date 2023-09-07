import { Response } from "express";
import { BaseException } from "../exceptions";

export default class ServerResponse {
  constructor(private readonly res: Response) {}

  static create(res: Response) {
    return new ServerResponse(res);
  }

  success(message: string): void;
  success(message: string, code: number): void;
  success(message: string, data: any): void;
  success(message: string, data: any, code: number): void;
  success(...args: any[]) {
    let code: number = 200;
    let data: any = undefined;
    let message: string = "";

    switch (args.length) {
      case 1:
        message = args[0];
        code = 200;
        break;

      case 2:
        message = args[0];
        if (typeof args[1] === "number") {
          code = args[1];
        } else {
          data = args[1];
        }
        break;

      default:
        message = args[0];
        data = args[1];
        code = args[2];
    }

    this.res.status(code).json({
      success: true,
      code,
      message,
      data,
    });
  }

  error(error: BaseException): void;
  error(error: Error): void;
  error(message: string, code: number): void;
  error(...args: any[]): void {
    let errorObject: BaseException;

    switch (args.length) {
      case 1: {
        if (args[0] instanceof BaseException) {
          errorObject = args[0];
        } else {
          let err: Error = args[0];
          errorObject = new BaseException(err.message);
        }
        break;
      }

      default: {
        errorObject = new BaseException(args[0], args[1]);
      }
    }

    this.res.status(errorObject.getCode()).json({
      success: false,
      ...errorObject.getObject(),
    });
  }
}
