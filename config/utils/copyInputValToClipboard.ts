import { ID } from "../types/root_types";
import { isEmpty, nullthrows } from "./nullchecks";

type CopyInputValToClipboardArgs = {
  inputID: string;
};

export function copyInputValToClipboard({
  inputID,
}: CopyInputValToClipboardArgs): boolean {
  /* Get the text field */
  let inputEl = document.getElementById(inputID);
  if (!Boolean(inputEl)) {
    return false;
  }

  // typing
  inputEl = nullthrows(inputEl);

  // // @ts-ignore HTMLEl has attr select
  // inputEl.select();
  // // @ts-ignore HTMLEl has attr setSelectionRange
  // inputEl.setSelectionRange(0, 99999); /* For mobile devices */

  // @ts-ignore HTMLEl has attr value
  const inputElValue = inputEl.value;
  if (isEmpty(inputElValue)) {
    return false;
  }
  navigator.clipboard.writeText(inputElValue ?? "");
  return true;
}
