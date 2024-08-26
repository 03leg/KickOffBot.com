import { isNil } from "lodash";

export function getPreviewTelegramMessage(html: string) {
  if (isNil(html)) {
    return html;
  }

  const matches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

  for (const m of matches) {
    const value = m[1];
    html = isNil(value) ? html : html.replace(m[0], `${value}`);
  }

  return html.slice(0, 60) + (html.length > 60 ? "..." : "");
}
