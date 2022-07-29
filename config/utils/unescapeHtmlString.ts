import { NullableString } from "../types/root_types";

export function unescapeHtmlString(htmlStr: NullableString): string {
  return (htmlStr ?? "")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"');
}
