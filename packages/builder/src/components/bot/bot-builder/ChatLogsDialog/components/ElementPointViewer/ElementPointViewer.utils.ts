function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function getColorByString(str: string) {
  return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
}
