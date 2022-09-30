import { isNullOrUndefined } from "./nullchecks";
import { NullableString } from "../types/root_types";
import { parseCookies, setCookie } from "nookies";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie" | "localStorage";

const storageKeyPrefix = "researchhub";

export function storeToCookieOrLocalStorage({ key, value }: Args): StorageType {
  if (isNullOrUndefined(typeof window)) {
    setCookie(null, key, value ?? "");
    return "cookie";
  } else {
    localStorage.setItem(`${storageKeyPrefix}.${key}`, value ?? "");
    return "localStorage";
  }
}

export function getCookieOrLocalStorageValue({ key }: { key: string }): {
  storageType: StorageType;
  value: NullableString;
} {
  if (isNullOrUndefined(typeof window)) {
    const cookies = parseCookies();
    return { value: cookies[key], storageType: "cookie" };
  } else {
    return {
      value: localStorage.getItem(`${storageKeyPrefix}.${key}`),
      storageType: "localStorage",
    };
  }
}
