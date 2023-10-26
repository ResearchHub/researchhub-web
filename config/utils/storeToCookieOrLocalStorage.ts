import { isNullOrUndefined } from "./nullchecks";
import { NullableString } from "../types/root_types";
import { parseCookies, setCookie } from "nookies";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie" | "localStorage";

const storageKeyPrefix = "researchhub";

export function storeToCookieAndLocalStorage({
  key,
  value,
}: Args): StorageType {
  setCookie(null, key, value ?? "", {
    maxAge: 30 * 24 * 60 * 60,
  });
  localStorage.setItem(`${storageKeyPrefix}.${key}`, value ?? "");
}

export function storeToCookieOrLocalStorage({ key, value }: Args): StorageType {
  if (isNullOrUndefined(typeof window)) {
    setCookie(null, key, value ?? "");
    return "cookie";
  } else {
    localStorage.setItem(`${storageKeyPrefix}.${key}`, value ?? "");
    return "localStorage";
  }
}

export function getCookieOrLocalStorageValue({
  key,
  ctx,
}: {
  key: string;
  ctx: any;
}): {
  storageType: StorageType;
  value: NullableString;
} {
  if (isNullOrUndefined(typeof window)) {
    const cookies = parseCookies(ctx);
    return { value: cookies[key], storageType: "cookie" };
  } else {
    return {
      value: localStorage.getItem(`${storageKeyPrefix}.${key}`),
      storageType: "localStorage",
    };
  }
}
