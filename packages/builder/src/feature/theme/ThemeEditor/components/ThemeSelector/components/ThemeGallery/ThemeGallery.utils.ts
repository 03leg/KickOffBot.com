import { ThemeResponse } from "~/types/Bot";

export function getUniqueThemeTitle(themes: ThemeResponse[]) {
  const template = "Theme #";
  let index = 1;

  const titles = themes.map((t) => t.title);

  do {
    const title = template + index++;

    if (!titles.includes(title)) {
      return title;
    }
  } while (true);
}
