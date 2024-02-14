import { BotProject } from "@kickoffbot.com/types";
import { MyTelegramBot } from "./MyTelegramBot";
import process from "process";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: "../../builder/.env",
});

const botDescription: BotProject = {"blocks":[{"id":"/start","blockType":1,"title":"/start","position":{"x":0,"y":0},"elements":[]},{"id":"d98d7933-09c7-41b0-9651-77a52ae69236","blockType":0,"title":"Block #1","position":{"x":422,"y":217.80001831054688},"elements":[{"id":"content-text-01e26f7a-9519-4d85-be5a-2621465d6ed2","type":"content-text","attachments":[],"json":"{\"blocks\":[{\"key\":\"aqdt4\",\"text\":\"Hi there!\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","htmlContent":"<p>Hi there!</p>","telegramContent":"Hi there!"},{"id":"content-text-b268ed9e-429d-4325-b368-b2e5be687936","type":"content-text","attachments":[],"json":"{\"blocks\":[{\"key\":\"334fn\",\"text\":\"Score: <%variables.score%>\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","htmlContent":"<p>Score: &lt;%variables.score%&gt;</p>","telegramContent":"Score: &lt;%variables.score%&gt;"},{"id":"logic-change-variable-b1003053-efd2-4dba-9d92-5a33f14da9a6","type":"logic-change-variable","selectedVariableId":"d19de227-a494-4fcd-9b32-61b6f936f96c","workflowDescription":{"expression":"5"}},{"id":"content-text-66de546b-5133-41a5-9548-a80d6ea536de","type":"content-text","attachments":[],"json":"{\"blocks\":[{\"key\":\"838id\",\"text\":\"Score: <%variables.score%> What should we add?\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","htmlContent":"<p>Score: &lt;%variables.score%&gt; What should we add?</p>","telegramContent":"Score: &lt;%variables.score%&gt; What should we add?"},{"id":"input-text-eb98f85f-0ecf-454b-9435-c27f7e939e94","label":"User input...","type":"input-text","variableId":"c375195c-cade-4203-be49-dc51354d2606"},{"id":"logic-change-variable-274fccfe-9592-45b4-8b5e-8b33156d534f","type":"logic-change-variable","selectedVariableId":"d19de227-a494-4fcd-9b32-61b6f936f96c","workflowDescription":{"expression":"<%variables.score%> + 5"}},{"id":"content-text-e921ddc7-c1a6-4afd-9b1a-e9fba6fe6219","type":"content-text","attachments":[],"json":"{\"blocks\":[{\"key\":\"9hrna\",\"text\":\"<%variables.score%> + <%variables.score_text%>\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","htmlContent":"<p>&lt;%variables.score%&gt; + &lt;%variables.score_text%&gt;</p>","telegramContent":"&lt;%variables.score%&gt; + &lt;%variables.score_text%&gt;"}]},{"id":"bca7ed31-03dc-4049-8f50-023b153cf8d6","blockType":0,"title":"Block #2","position":{"x":1031.7999877929688,"y":411.4000244140625},"elements":[{"id":"content-text-93aedd53-4e74-4728-b173-29dc834ae0dd","type":"content-text","attachments":[],"json":"{\"blocks\":[{\"key\":\"4g63l\",\"text\":\"Hi!\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","htmlContent":"<p>Hi!</p>","telegramContent":"Hi!"},{"id":"input-buttons-e6564668-3301-46db-b1c6-b5f66f16038a","type":"input-buttons","buttons":[{"content":"repeat","id":"6f321bf4-cced-4e7e-b5fb-f85928bd535a"},{"content":"Finish","id":"a5650773-0f40-472d-8acb-528d6380329d"}]}]}],"links":[{"id":"03d3183d-ed3d-4367-add1-50ae25a76bce","input":{"blockId":"d98d7933-09c7-41b0-9651-77a52ae69236","type":0},"output":{"blockId":"/start","type":0}},{"id":"8e8e9e37-d671-4864-9bb2-1ffada3c0b7c","input":{"blockId":"bca7ed31-03dc-4049-8f50-023b153cf8d6","type":0},"output":{"blockId":"d98d7933-09c7-41b0-9651-77a52ae69236","type":0}},{"id":"35e61ac8-1a1c-41d1-9b20-9e0f91e1fb9e","input":{"blockId":"d98d7933-09c7-41b0-9651-77a52ae69236","type":0},"output":{"blockId":"bca7ed31-03dc-4049-8f50-023b153cf8d6","buttonId":"6f321bf4-cced-4e7e-b5fb-f85928bd535a","elementId":"input-buttons-e6564668-3301-46db-b1c6-b5f66f16038a","type":2}}],"variables":[{"id":"d19de227-a494-4fcd-9b32-61b6f936f96c","name":"score","type":"number","value":0},{"id":"c375195c-cade-4203-be49-dc51354d2606","name":"score_text","type":"string","value":"default value"}],"transformDescription":{"x":416,"y":172,"scale":0.62}};

(function start() {
  console.log("started!");

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
