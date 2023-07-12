const BASE_URL = "https://researchhub.ngrok.io";
export const RESEARCHHUB_AUTH_TOKEN = "researchhub.auth.token";

export const generateApiUrl = (url: string, queryparams?: string) => {
  return `${BASE_URL}/api/${url}/${queryparams ? queryparams : ""}`;
};

// HTTP Configurations
export const GET_CONFIG = ({ token }: { token?: string }) => {
  const headers = setupRequestHeaders({ noContentType: false, overrideToken: token });
  return {
    method: "GET",
    headers: headers,
  };
};
export const POST_CONFIG = ({ data }) => {
  const headers = setupRequestHeaders({ noContentType: false });
  return {
    method: "post",
    body: JSON.stringify(data),
    headers: headers,
  };
};
export const PUT_CONFIG = ({ data }) => {
  const headers = setupRequestHeaders({ noContentType: false });
  return {
    method: "put",
    body: JSON.stringify(data),
    headers: headers,
  };
};
export const PATCH_CONFIG = ({ data }) => {
  const headers = setupRequestHeaders({ noContentType: false });
  return {
    method: "patch",
    body: JSON.stringify(data),
    headers: headers,
  };
};
export const DELETE_CONFIG = () => {
  const headers = setupRequestHeaders({ noContentType: false });
  return {
    method: "delete",
    headers: headers,
  };
};

const setupRequestHeaders = ({ noContentType, overrideToken }: { noContentType?: boolean; overrideToken?: string }) => {
  let headers: { "Content-Type"?: string; Authorization?: string } = {
    "Content-Type": "application/json",
  };

  if (noContentType) {
    headers = {};
  }

  let token = window.localStorage.getItem(RESEARCHHUB_AUTH_TOKEN);

  if (overrideToken && overrideToken !== "undefined") {
    token = overrideToken;
  }

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  return headers;
};
