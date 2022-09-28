import { parseCookies, setCookie } from "nookies";
import { NullableString } from "../types/root_types";
import { isNullOrUndefined } from "./nullchecks";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie";

const storageKeyPrefix = "researchhub";

export function storeToCookie({ key, value }: Args): StorageType {
  setCookie(null, key, value ?? "");
  return "cookie";
}

export function getCookieValue({ key }: { key: string }): {
  storageType: StorageType;
  value: NullableString;
} {
  const cookies = parseCookies();
  return { value: cookies[key], storageType: "cookie" };
}
