import serverConfig from "../../config/app.config";
import { AuthToken } from "./auth.token";

const authToken = new AuthToken(serverConfig.AUTH_TOKEN_SECRET);

export { authToken };
