function stripHtml(html: string): string {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return (tmp.textContent ?? tmp.innerText) || "";
}

export function getTemplateContent(html: string, isPlainText: boolean): string {
  html = html
    .replaceAll("<p><br></p>", "<br>")
    .replaceAll("<p>", "")
    .replaceAll("</p>", "");

  if (!isPlainText) {
    return html;
  }

  return stripHtml(html);
}
