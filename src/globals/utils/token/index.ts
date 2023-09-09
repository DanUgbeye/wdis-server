import serverConfig from "../../config/app.config";
import { AccessTokenUtility, RefreshTokenUtility } from "./token";

const accessTokenUtility = new AccessTokenUtility(serverConfig.ACCESS_TOKEN_SECRET);
const refreshTokenUtility = new RefreshTokenUtility(serverConfig.REFRESH_TOKEN_SECRET);

export { accessTokenUtility, refreshTokenUtility };
