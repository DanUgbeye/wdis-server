class ServerConfig {
  public readonly PORT: number;
  /** Mongo DB connection string */
  public readonly MONGO_URI: string;

  /** Token secret for signing JWt tokens */
  public readonly AUTH_TOKEN_SECRET: string;

  constructor() {
    this.PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
    this.MONGO_URI = process.env.MONGO_URI as string;
    this.AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET as string;
  }
}

const serverConfig = new ServerConfig();

export default serverConfig;
