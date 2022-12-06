import { isNullOrUndefined } from "./nullchecks";
import { NullableString } from "../types/root_types";
import removeMd from "remove-markdown";

export function htmlStringToPlainString(
  html: NullableString,
  stringLimit?: number
): string {
  let targetHTML = isNullOrUndefined(stringLimit)
    ? html
    : (html ?? "").substring(0, stringLimit);
  return removeMd(targetHTML ?? "").replace(/&nbsp;/g, " ");
}
