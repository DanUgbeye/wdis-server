class ServerConfig {
  public readonly PORT: number;
  /** Mongo DB connection string */
  public readonly MONGO_URI: string;

  /** access token secret for signing JWt tokens */
  public readonly ACCESS_TOKEN_SECRET: string;
  /** refresh token secret for signing JWt tokens */
  public readonly REFRESH_TOKEN_SECRET: string;

  /** server url */
  public readonly SERVER_BASE_URL: string;
  /** server url */
  public readonly CLIENT_BASE_URL: string;

  constructor() {
    this.PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
    this.MONGO_URI = process.env.MONGO_URI as string;
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
    this.SERVER_BASE_URL = process.env.SERVER_BASE_URL as string;
    this.CLIENT_BASE_URL = process.env.CLIENT_BASE_URL as string;
  }
}

const serverConfig = new ServerConfig();

export default serverConfig;
