import {
  BackgroundColorSchema,
  WebChatBackgroundDescription,
} from "@kickoffbot.com/types";

export function getBackgroundColor(
  background?: WebChatBackgroundDescription
): string | undefined {
  switch (background?.schema) {
    case BackgroundColorSchema.OneColor:
      return background.color1 ?? "#ffffff";
    case BackgroundColorSchema.Schema1:
      return `linear-gradient(to right, ${background.color1}, ${background.color2})`;
    case BackgroundColorSchema.Schema2:
      return `radial-gradient(circle farthest-side, ${background.color1}, ${background.color2})`;
    case BackgroundColorSchema.Schema3:
      return `radial-gradient(circle farthest-corner at 22.4% 21.7%, ${background.color1} 0%, ${background.color2} 100.2% )`;
    default:
      return undefined;
  }
}

export function getBackgroundImage(
  background?: WebChatBackgroundDescription
): string | undefined {
  if (!background || background.schema !== BackgroundColorSchema.Image) {
    return undefined;
  }
  const result = `url(${background.imageUrl})`;
  return result;
}
