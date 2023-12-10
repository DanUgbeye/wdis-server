import mongoose from "mongoose";
import serverConfig from "../../config/server.config";

class Database {
  async connect() {
    return mongoose.connect(serverConfig.MONGO_URI);
  }

  async handleError(error: any | Error) {}
}

const database = new Database();

export default database;
