---
sidebar_position: 1
---
# User Input

This element lets you receive messages that users send to the bot. Let's see how this element works with a simple bot example. The bot asks the user for their age and then uses the [Message](./message-element.md) element to show the user their age.

![Drag and drop user input element](./img/input/user-input-drag-and-drop-from-toolbox.PNG)

This element stores the message received from the user in a variable. Let’s [create a variable](../variables.md#manage-bot-variable) to hold the user’s age.

![Create new variable](./img/input/user-input-new-variable.PNG)

Now, we need to open the element editor.

![Open user input element editor](./img/input/open-user-input-editor.png)

In the editor, we need to set the variable where the bot will store the user's age.

![Configure user input element](./img/input/user-input-configuration.PNG)

To complete our simple bot, we'll add a message that displays the user's age and then asks them for their age again.

![User input demo bot design](./img/input/user-input-demo-bot-design.PNG)

Now, we can save, run the bot, and see how it works.

![User input demo bot view](./img/input/user-input-demo-bot.gif)