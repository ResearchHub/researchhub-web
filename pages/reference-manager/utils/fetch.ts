import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/";
export const AUTH_TOKEN = "researchhub.auth.token";

const setupRequestHeaders = ({
  overrideToken = null,
}: {
  overrideToken?: string;
}) => {
  const headers = {
    "Content-Type": "application/json",
  };

  let token = "";

  if (process.browser) {
    token = window.localStorage[AUTH_TOKEN];
  }

  if (overrideToken && overrideToken !== "undefined") {
    token = overrideToken;
  }

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  return headers;
};

// HTTP Configurations
export const GET_CONFIG = ({ overrideToken }: { overrideToken?: string }) => {
  const headers = setupRequestHeaders({ overrideToken });
  return {
    method: "GET",
    headers: headers,
  };
};
export const POST_CONFIG = ({ data }) => {
  const headers = setupRequestHeaders({});
  return {
    method: "post",
    body: JSON.stringify(data),
    headers: headers,
  };
};
export const PUT_CONFIG = ({ data }) => {
  const headers = setupRequestHeaders({});
  return {
    method: "put",
    body: JSON.stringify(data),
    headers: headers,
  };
};
export const PATCH_CONFIG = ({ data }) => {
  const headers = setupRequestHeaders({});
  return {
    method: "patch",
    body: JSON.stringify(data),
    headers: headers,
  };
};
export const DELETE_CONFIG = () => {
  const headers = setupRequestHeaders({});
  return {
    method: "delete",
    headers: headers,
  };
};

export function generateApiUrl({
  pathName,
  querystring,
}: {
  pathName: string;
  querystring?: string;
}) {
  const url = new URL(pathName, API_URL).toString();

  if (!querystring) {
    return url;
  }

  return new URL(`${url}?${new URLSearchParams(querystring)}`).toString();
}

export function saveToLocalStorage(key, value) {
  var storage = window.localStorage;
  storage.setItem(key, value);
  if (value) {
    Cookies.set(key, value);
  }
  return;
}
