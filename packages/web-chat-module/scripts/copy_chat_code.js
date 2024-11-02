import fs from "fs";

console.log("prebuild start");

fs.rmSync("./src/chat-bot/components", { recursive: true, force: true });
fs.rmSync("./src/chat-bot/connector", { recursive: true, force: true });
fs.rmSync("./src/chat-bot/store", { recursive: true, force: true });
fs.rmSync("./src/chat-bot/theme", { recursive: true, force: true });
fs.rmSync("./src/chat-bot/utils", { recursive: true, force: true });

const dest = "./src/chat-bot/";

fs.cpSync("../builder/src/components/bot/bot-builder/WebBotDemo/components", dest + "components", { recursive: true });
fs.cpSync("../builder/src/components/bot/bot-builder/WebBotDemo/connector", dest + "connector", { recursive: true });
fs.cpSync("../builder/src/components/bot/bot-builder/WebBotDemo/store", dest + "store", { recursive: true });
fs.cpSync("../builder/src/components/bot/bot-builder/WebBotDemo/theme", dest + "theme", { recursive: true });
fs.cpSync("../builder/src/components/bot/bot-builder/WebBotDemo/utils", dest + "utils", { recursive: true });

console.log("prebuild done");
