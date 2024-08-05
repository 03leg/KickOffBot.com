---
sidebar_position: 0
---
# Message

The `Message` element is the most important element; it helps send text, images, documents, and inline buttons to the bot user. To use it, simply drag and drop it from the toolbox onto the designer area.

![Message element demo](./img/message-element-drag-and-drop.PNG)

After that, you can edit the `Message` element by clicking the `Edit Element` button.

![Edit element button](./img/edit-element-button.png)

The message editor allows you to edit text, format it, and attach images and documents to the messages that the bot sends to users.

![Message editor](./img/message-editor.PNG)

It is also possible to add inline buttons to your message. The source of the buttons can be your design in the message or a variable. If you are not familiar with the concept of variables on the KickoffBot platform, please read this.

Let's now add two inline buttons manually.

![Message editor](./img/inline-buttons-in-telegram-message.PNG)

![Welcome telegram bot message](./img/welcome-bot-message.PNG)

Let's connect our welcome message with the `/start` command, create two additional messages, and link them to the buttons from the welcome message.

![Telegram bot: messages demo - design](./img/messages-demo.PNG)

Now the bot is ready, so we can save and deploy it.

![Telegram bot: messages demo - runtime](./img/telegram-message-demo-bot.gif)
