import { parseCookies, setCookie } from "nookies";
import { NullableString } from "../types/root_types";
import { isNullOrUndefined } from "./nullchecks";
import Cookies from "js-cookie";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie";

export function storeToCookie({ key, value }: Args): StorageType {
  setCookie(null, key, value ?? "");
  return "cookie";
}
