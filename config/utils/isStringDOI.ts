import { isString } from "./string";

export const isStringDOI = (str: string | null): boolean => {
  if (!isString(str)) {
    return false;
  }
  // TODO: calvinhlee - improve this
  return new RegExp("10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?![\"&'<>])S)+").test(
    str!
  );
  return true;
};
