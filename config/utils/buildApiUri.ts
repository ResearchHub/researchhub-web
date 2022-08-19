import { getApiRootURI } from "~/config/utils/getApiRootURI";
import { isDevEnv } from "./env";

export function buildApiUri({
  apiPath,
  queryString,
}: {
  apiPath: string;
  queryString?: string;
}): string {
  return `${
    isDevEnv() ? "http:" : "https:"
  }//${getApiRootURI()}/api/${apiPath}/${queryString ?? ""}`;
}
