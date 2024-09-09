export function getUniqueCardName(names: string[], prefix = '') {
    let index = 1;

    do {
        const commandName = `${prefix}${index}`;
        if (!names.find(c => c === commandName)) {
            return commandName
        }
        index++;
    } while (true);
}