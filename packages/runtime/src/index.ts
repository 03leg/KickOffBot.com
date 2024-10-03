import process from "process";
import { ActiveBotsWatcher } from "./ActiveBotsWatcher";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: "../builder/.env",
});

void (async function start() {
  console.log("Telegram runtime started!");

  const instance = new ActiveBotsWatcher();
  await instance.watch();

  process.on("SIGINT", () => {
    console.log("Telegram runtime stopped!");

    process.exit();
  });

  process.stdin.resume();
})();
