import { BotProject } from "@kickoffbot.com/types";
import { MyTelegramBot } from "./MyTelegramBot";
import process from "process";
import fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: "../../builder/.env",
});

(function start() {
  console.log("started!");

  const botDescriptionString = fs.readFileSync("bot.json", "utf8");
  const botDescription: BotProject = JSON.parse(botDescriptionString);

  const newBot = new MyTelegramBot(
    process.env.TELEGRAM_BOT_TOKEN ?? "",
    botDescription
  );
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  newBot.setup();

  process.on("SIGINT", () => {
    process.exit();
  });

  process.stdin.resume();
})();
