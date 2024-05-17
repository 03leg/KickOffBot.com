export function getPreviewToken(token: string) {
  if (token.length < 10) {
    return token; // Return the original string if it has less than 6 characters
  }
  const maskedString = token.slice(0, 5) + "******" + token.slice(-5);
  return maskedString;
}
