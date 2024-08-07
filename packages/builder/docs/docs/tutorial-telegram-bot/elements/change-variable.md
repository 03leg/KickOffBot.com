---
sidebar_position: 2
---
# Change variable

This element lets you change variable values during user interaction with your bot. On this page, we’ll look at how to change different types of variables.

### Change `string` variable

Let’s look at how to change a string variable with an example bot. Depending on the user’s choice, this bot will either set a new value for the variable or reset it to the default. First, let’s create a string variable with a default value.

![Create string variable](./img/change-variable/string-create-variable.PNG)

Next, let’s design our bot. After the `/start` command, we’ll send the user a message showing the current value of our variable and ask them to choose an action: set a new value in Block #1 or reset the variable to its default value in Block #2.

![Change variable - demo bot design](./img/change-variable/string-change-variable-bot-config.PNG)

When changing the value of a variable, you can use the values from other variables.

![Change variable - editor](./img/change-variable/string-change-new-value-editor.PNG)

It looks like our bot is ready. Let’s save it and launch it.

![Change string demo](./img/change-variable/string-change-demo.gif)

### Change `number` variable

Let’s create a simple Telegram bot that adjusts a variable by one based on the user's choice. To start, let’s create a number variable.

![Create new number variable](./img/change-variable/number-new-variable.PNG)

Next, we’ll design our bot.

![Change number variable - bot design](./img/change-variable/number-demo-bot-design.PNG)

In Block #1, use an element that adds 1. In Block #2, use an element that subtracts 1.

![Change number demo](./img/change-variable/number-change-demo.gif)

### Change `boolean` variable

Changing a boolean variable is similar to updating number and string variables. You can set it to `True`, `False`, the opposite of its current value, or its default value.

![Change boolean variable - editor](./img/change-variable/boolean-editor.PNG)

### Change `object` variable

The value for an object variable can come from another object variable or an array of objects. If the source is another object variable, we simply copy its value. If the source is an array, we select one object from the array based on the conditions given in this element and copy that into our variable.

Let’s see how this works in practice when source is other object. We’ll create two object variables with different values.

![Object variable 1](./img/change-variable/object-var1.PNG)

![Object variable 2](./img/change-variable/object-var2.PNG)

Let's build our bot. When the `/start` command is sent, the bot will display the values of the first and second objects. When the user presses the button, it will copy the value from the second object to the first and send messages showing the updated values of both objects.

![Bot workflow - welcome message](./img/change-variable/object-bot-workflow-welocame-message.PNG)
![Bot workflow - change variable workflow](./img/change-variable/object-bot-workflow-change-object-variable-editor.PNG)
![Bot workflow](./img/change-variable/object-bot-workflow.PNG)

Let's start our bot and check how it works.

![Change object variable - demo bot](./img/change-variable/change-object-demo1.gif)

Let’s see how this works in practice when source is array of objects. We create an object variable that will get its value from an array of objects. We'll also need another variable to hold the array from which we'll select and copy an object into our object variable.

![Default value - object - variable editor](./img/change-variable/object-var-default-value.PNG)
![Default value - array - variable editor](./img/change-variable/object-var-array-default-value.PNG)

```js title="Default value - Array variable"
[
    {
        "productId": 1,
        "productName": "Margherita Pizza",
        "price": 8.99
    },
    {
        "productId": 2,
        "productName": "Pepperoni Pizza",
        "price": 10.49
    },
    {
        "productId": 3,
        "productName": "Vegetarian Pizza",
        "price": 11.29
    },
    {
        "productId": 4,
        "productName": "BBQ Chicken Pizza",
        "price": 12.49
    },
    {
        "productId": 5,
        "productName": "Hawaiian Pizza",
        "price": 10.99
    },
    {
        "productId": 6,
        "productName": "Buffalo Chicken Pizza",
        "price": 11.99
    },
    {
        "productId": 7,
        "productName": "Four Cheese Pizza",
        "price": 12.99
    },
    {
        "productId": 8,
        "productName": "Spinach and Feta Pizza",
        "price": 9.49
    },
    {
        "productId": 9,
        "productName": "Sausage Pizza",
        "price": 10.29
    }
]
```

Once our variables are set up, we can start designing our bot. After the `/start` command, we'll display the default object's values. When the user clicks the button, we'll select the first pizza from the array whose name starts with the letter `S`, copy this pizza into a variable, and show the values from that variable.

![Set value from array](./img/change-variable/object-set-value-from-array.PNG)
![Bot builder - design](./img/change-variable/object-array-bot-builder.PNG)

Now we can save it and see how our simple Telegram bot works.

![Change object variable - demo](./img/change-variable/object-change-var-demo2.gif)


### Change `array` variable

This element allows us to:

- Add items to an array variable from another array variable, with the option to filter which items to include and which to exclude.
![Add items to array from other array](./img/change-variable/array-change-add-items-to-array.PNG)
- Add object to an array variable
![Add object to array](./img/change-variable/array-add-object.PNG)
- Set a new value in an array based on another array
![Set new value from other array](./img/change-variable/array-set-new-value1.PNG)
- Update an array with a new value based on object
![Set new value from object](./img/change-variable/array-set-new-value2.PNG)
- Delete elements from an array with the option to filter which ones to keep or remove
![Remove items from array](./img/change-variable/array-remove-items.PNG)
