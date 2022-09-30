import { setCookie } from "nookies";
import { NullableString } from "../types/root_types";

type Args = {
  key: string;
  value: NullableString;
};

type StorageType = "cookie";

export function storeToCookie({ key, value }: Args): StorageType {
  setCookie(null, key, value ?? "");
  return "cookie";
}
