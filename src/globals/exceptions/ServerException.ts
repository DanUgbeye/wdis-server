import BaseException from "./BaseException";

class ServerException extends BaseException {
  constructor(message: string = "something went wrong on the server") {
    super(message, 500);
    this.type = "SERVER_ERROR";
  }
}

export default ServerException;
