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

## Inline buttons

It is also possible to add inline buttons to your message. The source of the buttons can be your design in the message or a variable of `Array` type. If you are not familiar with the concept of variables on the KickoffBot platform, [please read this](../variables.md).

### Manually added buttons

Let's now add two inline buttons manually.

![Message editor](./img/inline-buttons-in-telegram-message.PNG)

![Welcome telegram bot message](./img/welcome-bot-message.PNG)

Let's connect our welcome message with the `/start` command, create two additional messages, and link them to the buttons from the welcome message.

![Telegram bot: messages demo - design](./img/messages-demo.PNG)

Now the bot is ready, so we can save and deploy it.

![Telegram bot: messages demo - runtime](./img/telegram-message-demo-bot.gif)

### Buttons from variable

Let’s [create a variable](../variables.md#manage-bot-variable) where the default value is an array of objects. This variable will be used to generate the buttons for the current message.

![Variable - buttons source](./img/variable-buttons-source.PNG)

We’ll also need another variable to store the object linked to the button that the user clicks on in your bot.

![Variable - selected object button](./img/selected-object-button.PNG)

Then, in the Message editor, set the variable that will be data source of the buttons and choose the variable for saving the object associated with the chosen button. Note that you can use properties of the button’s object or static text in the button's label.

![Message editor - inline buttons from variable](./img/message-editor-inline-buttons-from-variable.PNG)
![Message viewer - inline buttons from variable](./img/message-viewer-inline-buttons-from-variable.PNG)

Once the user clicks on a button from the welcome message, we’ll send them a message with details about the selected object.

![Bot builder view - show selected object](./img/inline-buttons-show-selected-object.PNG)

Now, we can save the bot’s configuration and see it in action.

![Telegram-demo-buttons-from-variable](./img/telegram-message-buttons-from-variable.gif)
