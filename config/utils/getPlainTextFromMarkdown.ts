import removeMd from "remove-markdown";

export function getPlainTextFromMarkdown(text: string): string {
  return removeMd(text).replace(/&nbsp;/g, " ");
}
