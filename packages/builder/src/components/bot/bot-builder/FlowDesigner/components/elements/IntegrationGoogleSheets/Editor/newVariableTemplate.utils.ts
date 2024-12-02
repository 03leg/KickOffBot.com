export function getImportNewVariableTemplate(headers: string[]): string {
  const obj1: Record<string, string> = {};
  const obj2: Record<string, string> = {};

  for (const header of headers) {
    obj1[header] = "";
    obj2[header] = "";
  }

  return JSON.stringify(
    JSON.parse(`[${JSON.stringify(obj1)}, ${JSON.stringify(obj2)}]`),
    null,
    2
  );
}

export function getExportObjectNewVariableTemplate(headers: string[]): string {
  const obj1: Record<string, string> = {};

  for (const header of headers) {
    obj1[header] = "";
  }

  return JSON.stringify(obj1, null, 2);
}
