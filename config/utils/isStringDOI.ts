import { isString } from "./string";

export const isStringDOI = (str: string | null): boolean => {
  if (!isString(str)) {
    return false;
  }

  return new RegExp(/10.\d{4,9}\/[-._;()\/:a-zA-Z0-9]+(?=[\"])/).test(
    String(str).toLowerCase()
  );
};
