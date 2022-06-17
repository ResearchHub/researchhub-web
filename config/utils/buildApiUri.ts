import { getApiRootURI } from "~/config/utils/getApiRootURI";
import { isDevEnv } from "./env";

export function buildApiUri({ apiPath }: { apiPath: string }): string {
  return `${isDevEnv() ? "http:" : "https:"}//${getApiRootURI()}/api/${apiPath}/`;
}
