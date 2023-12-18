import removeMd from "remove-markdown";

export function getPlainTextFromMarkdown(text: string | TrustedHTML): string {
  return removeMd(text).replace(/&nbsp;/g, " ");
}
