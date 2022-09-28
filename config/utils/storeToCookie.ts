import { parseCookies, setCookie } from "nookies";
import { NullableString } from "../types/root_types";
import { isNullOrUndefined } from "./nullchecks";
import Cookies from "js-cookie";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie";

const storageKeyPrefix = "researchhub";

export function storeToCookie({ key, value }: Args): StorageType {
  Cookies.set(key, value ?? "");
  // debugger;
  return "cookie";
}

// getCookieValue NEEDS TO BE CHANGED
export function getCookieValue({ key }: { key: string }): {
  storageType: StorageType;
  value: NullableString;
} {
  // debugger;
  return { value: Cookies.get(key), storageType: "cookie" };
}
