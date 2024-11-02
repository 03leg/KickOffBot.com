export function getYoutubeIdFromUrl(url: string) {
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match?.[2] && match[2].length === 11 ? match[2] : null;
  } catch (e) {
    return null;
  }
}
