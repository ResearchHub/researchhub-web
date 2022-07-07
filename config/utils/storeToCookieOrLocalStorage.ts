import { parseCookies, setCookie } from "nookies";
import { NullableString } from "../types/root_types";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie" | "localStorage";

const storageKeyPrefix = "researchhub";

export function storeToCookieOrLocalStorage({ key, value }: Args): StorageType {
  if (typeof window === "undefined") {
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
  if (typeof window === "undefined") {
    const cookies = parseCookies();
    return { value: cookies[key], storageType: "cookie" };
  } else {
    return {
      value: localStorage.getItem(`${storageKeyPrefix}.${key}`),
      storageType: "localStorage",
    };
  }
}
