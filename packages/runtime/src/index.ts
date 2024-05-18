import process from "process";
import{ ActiveBotsWatcher} from "./ActiveBotsWatcher"

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: "../builder/.env",
});

void (async function start() {
  console.log("started!");

  const instance = new ActiveBotsWatcher();
  await instance.watch();

  process.on("SIGINT", () => {
    process.exit();
  });

  process.stdin.resume();
})();
