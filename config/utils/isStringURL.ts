import { isEmpty } from "./nullchecks";
import { isString } from "./string";

// Deprecated Regex based URL check
// export const isStringURL = (str: string | null): boolean => {
//   if (!isString(str) || isEmpty(str)) {
//     return false;
//   }

//   return new RegExp(
//     /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
//   ).test(String(str).toLowerCase());
// };

export const isStringURL = (str: string | null): boolean => {
  if (!isString(str) || isEmpty(str)) {
    return false;
  }
  try { 
    return Boolean( new URL(str)); 
  }
  catch(e) { 
    return false; 
  }
}
