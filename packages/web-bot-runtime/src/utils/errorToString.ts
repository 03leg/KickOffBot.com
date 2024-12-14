export function errorToString(error: unknown): string {
  if (error instanceof Error) {
    let result =
      `${error.name}: ${error.message}` +
      (error.stack ? `\n${error.stack}` : '');

    const customError = error as any;

    if (customError.cause) {
      result += `\n${customError.cause}`;
    }

    if (customError.originalError) {
      result += `\n${customError.originalError}`;
    }

    return result;
  }

  return String(error);
}
