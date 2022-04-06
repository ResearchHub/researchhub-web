import { isString } from "./string";

export const isStringDOI = (str: string | null): boolean => {
  if (!isString(str)) {
    return false;
  }
  // TODO: calvinhlee - improve this
  // return new RegExp("/^10.d{4,9}/[-._;()/:A-Z0-9]+$/i").test(str!);
  return true;
};
