import { BotProject } from "@kickoffbot.com/types";
import { MyTelegramBot } from "./MyTelegramBot";
import process from "process";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: "../.env",
});

const botDescription: BotProject = {
  blocks: [
    {
      id: "/start",
      blockType: 1,
      title: "/start",
      position: { x: 291, y: 44 },
      elements: [],
    },
    {
      id: "18b194a3-e4a1-401a-9568-5634d18fca24",
      blockType: 0,
      title: "Block #1",
      position: { x: 346.79998779296875, y: 430.6000061035156 },
      elements: [
        {
          id: "content-text-1aabb487-0a44-499f-a0e4-f3b220b1d87b",
          type: "content-text",
          json: '{"blocks":[{"key":"fcf14","text":"Hello! What is your name?","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":20,"length":4,"style":"ITALIC"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
          htmlContent: "<p>Hello! What is your <em>name</em>?</p>",
          telegramContent: "Hello! What is your <em>name</em>?",
        },
        {
          id: "input-text-a8880bac-03e1-4db2-bb38-218ff6b10f60",
          label: "User input...",
          type: "input-text",
          input: null,
          variableId: "62babd4e-72db-4bb7-9632-848c00977482",
        },
        {
          id: "content-text-87652f30-863b-492d-9893-353d078ca4e8",
          type: "content-text",
          json: '{"blocks":[{"key":"87bik","text":"Nice to meet with you, <%variables.user_name_input%>! How is your day, <%variables.user_name_input%>?","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":21,"style":"BOLD"},{"offset":71,"length":29,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
          htmlContent:
            "<p><strong>Nice to meet with you</strong>, &lt;%variables.user_name_input%&gt;! How is your day, <strong>&lt;%variables.user_name_input%&gt;</strong>?</p>",
          telegramContent:
            "<b>Nice to meet with you</b>, &lt;%variables.user_name_input%&gt;! How is your day, <b>&lt;%variables.user_name_input%&gt;</b>?",
        },
        {
          id: "input-buttons-07326d43-e718-43a9-8c7b-dc02f6ae6490",
          type: "input-buttons",
          buttons: [
            {
              content: "Great day!",
              id: "e5e5f8e7-e80a-4640-9cbe-885da616323b",
            },
            { content: "Bad day!", id: "7d2a566c-9899-4769-8761-c7d653682c16" },
          ],
        },
      ],
    },
    {
      id: "089532b0-1d9c-4204-a5ff-2d3ead43baaa",
      blockType: 0,
      title: "Block #2",
      position: { x: 1259.9551874416975, y: -33.82089552238806 },
      elements: [
        {
          id: "content-text-19594c15-481d-43ac-ac56-522e6d5a7454",
          type: "content-text",
          json: '{"blocks":[{"key":"6elum","text":"I like that you have a great day!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
          htmlContent: "<p>I like that you have a great day!</p>",
          telegramContent: "I like that you have a great day!",
        },
      ],
    },
    {
      id: "4fffc478-bbcf-4137-9fae-06c1a6b06a35",
      blockType: 0,
      title: "Block #3",
      position: { x: 1317.6418639225744, y: 123.47760283057369 },
      elements: [
        {
          id: "content-text-d52ea102-4db2-4e94-bf94-8162052fa907",
          type: "content-text",
          json: '{"blocks":[{"key":"cnqdf","text":"Don\'t worry, be happy, <%variables.user_name_input%>!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":23,"style":"BOLD"},{"offset":52,"length":1,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
          htmlContent:
            "<p><strong>Don't worry, be happy, </strong>&lt;%variables.user_name_input%&gt;<strong>!</strong></p>",
          telegramContent:
            "<b>Don't worry, be happy, </b>&lt;%variables.user_name_input%&gt;<b>!</b>",
        },
      ],
    },
  ],
  links: [
    {
      id: "69a0c780-bcd8-4a25-abdc-3c9f63a16870",
      input: { blockId: "18b194a3-e4a1-401a-9568-5634d18fca24" },
      output: { blockId: "/start" },
    },
    {
      id: "310d5bf6-812b-4612-934d-4781cdb61dc5",
      input: { blockId: "089532b0-1d9c-4204-a5ff-2d3ead43baaa" },
      output: {
        blockId: "18b194a3-e4a1-401a-9568-5634d18fca24",
        buttonId: "e5e5f8e7-e80a-4640-9cbe-885da616323b",
        elementId: "input-buttons-07326d43-e718-43a9-8c7b-dc02f6ae6490",
      },
    },
    {
      id: "51e21059-ef09-42c4-b01e-e418c21929b7",
      input: { blockId: "4fffc478-bbcf-4137-9fae-06c1a6b06a35" },
      output: {
        blockId: "18b194a3-e4a1-401a-9568-5634d18fca24",
        buttonId: "7d2a566c-9899-4769-8761-c7d653682c16",
        elementId: "input-buttons-07326d43-e718-43a9-8c7b-dc02f6ae6490",
      },
    },
  ],
  variables: [
    {
      id: "62babd4e-72db-4bb7-9632-848c00977482",
      name: "user_name_input",
      type: "string",
      value: "friend",
    },
  ],
  transformDescription: { x: 258, y: 153, scale: 0.67 },
};

(function start() {
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
