import { apiRoot } from "~/config/api";
import { getCurrServerEnv } from "./env";

export function getApiRootURI(): string {
  const currServerEnv = getCurrServerEnv();
  return apiRoot[currServerEnv] ?? apiRoot.dev;
}
