import mongoose from "mongoose";
import serverConfig from "../../config/app.config";

class Database {
  async connect() {
    return mongoose.connect(serverConfig.MONGO_URI);
  }

  async handleError(error: any) {}
}

const database = new Database();

export default database;
