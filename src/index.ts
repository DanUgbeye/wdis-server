import server from "./socket";
import serverConfig from "./globals/config/server.config";
import database from "./globals/lib/database";

database
  .connect()
  .then(() => {
    console.log(`⚡connected to database⚡`);
    server.listen(serverConfig.PORT);
    console.log(`server running on port ${serverConfig.PORT} ✅`);
  })
  .catch((err) => {
    console.log("\n ❌❌❌ An Error occured ❗⚠️\n");
    console.log(err);
  });
