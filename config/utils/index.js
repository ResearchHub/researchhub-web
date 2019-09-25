export function endsWithSlash(text) {
  if (!text) {
    return false;
  }
  const lastChar = text.charAt(text.length - 1);
  return lastChar === "/";
}
