import { isEmpty } from "./nullchecks";
import { isString } from "./string";

export const isStringDOI = (str: string | null): boolean => {
  if (!isString(str) || isEmpty(str)) {
    return false;
  }
  // TODO: calvinhlee - improve this
  return true;
  // return new RegExp("10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?![\"&'<>])S)+").test(
  //   str!
  // );
};
