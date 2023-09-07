import app from "./app";
import serverConfig from "./globals/config/app.config";
import database from "./globals/lib/database";

database
  .connect()
  .then(() => {
    console.log(`⚡connected to database⚡`);
    app.listen(serverConfig.PORT);
    console.log(`server running on port ${serverConfig.PORT} ✅`);
  })
  .catch((err) => {
    console.log("\n ❌❌❌ An Error occured ❗⚠️\n");
    console.log(err);
  });
