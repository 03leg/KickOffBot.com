export function getUniqueBotName(prefix: string, botNames: string[]) {
  let index = 1;

  do {
    const newBotName = `${prefix}${index}`;
    if (!botNames.find((botName) => botName === newBotName)) {
      return newBotName;
    }
    index++;
  } while (true);
}
