import { parseCookies, setCookie } from "nookies";
import { NullableString } from "../types/root_types";
import { isNullOrUndefined } from "./nullchecks";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie" | "localStorage";

const storageKeyPrefix = "researchhub";

export function storeToLocalStorage({ key, value }: Args): StorageType {
  localStorage?.setItem(`${storageKeyPrefix}.${key}`, value ?? "");
  return "localStorage";
}

export function getLocalStorageValue({ key }: { key: string }): {
  storageType: StorageType;
  value: NullableString;
} {
  return {
    value: localStorage?.getItem(`${storageKeyPrefix}.${key}`),
    storageType: "localStorage",
  };
}
