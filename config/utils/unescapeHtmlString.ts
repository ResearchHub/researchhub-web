import { NullableString } from "../types/root_types";

export function unescapeHtmlString(htmlStr: NullableString): string {
  return (htmlStr ?? "")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#([0-9]{1,3});/gi, function (_match, numStr) {
      // parsing numerics
      var num = parseInt(numStr, 10); 
      return String.fromCharCode(num);
    });
}
