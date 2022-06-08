import { getApiRootURI } from "~/config/utils/getApiRootURI";

export function buildApiURI({ apiPath }: { apiPath: string }): string {
  return `http://${getApiRootURI()}/api/${apiPath}/`;
}
