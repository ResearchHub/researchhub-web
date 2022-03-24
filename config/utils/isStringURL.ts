import { isString } from "./string";

const urlRegEx = new RegExp(
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
);

export const isStringURL = (str: string | null): boolean => {
  // console.warn("THE FUCK IS THIS: ", str)
  if (!isString(str)) {
    return false;
  }

  return urlRegEx.test(String(str).toLowerCase());
};
