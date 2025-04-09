import Cookies from "js-cookie";
import { getAuthToken } from "../utils/auth";

/**
 * Module define all API paths
 * author: @patr -- patrick@quantfive.org
 */

/*
 * Request methods. Case sensitive.
 */
const GET = "GET";
const POST = "POST";
const PATCH = "PATCH";
const PUT = "PUT";
const DELETE = "DELETE";

/**
 * getApiRoot() Returns the base URL for api to connect to
 * @return {string} The hostname of the backend server
 */
function getApiRoot({ PRODUCTION_SITE, STAGING_SITE, LOCALHOST }) {
  if (process.env.REACT_APP_API_ROOT) {
    return process.env.REACT_APP_API_ROOT;
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "https://" + STAGING_SITE + "/api/";
  } else if (process.env.NODE_ENV === "production") {
    return "https://" + PRODUCTION_SITE + "/api/";
  } else {
    return "http://" + LOCALHOST + "/api/";
  }
}

function setupRequestHeaders(noContentType, authTokenName, overrideToken) {
  let token = "";

  if (process.browser) {
    token = getAuthToken();
  }

  if (overrideToken && overrideToken !== "undefined") {
    token = overrideToken;
  }

  var headers = {
    "Content-Type": "application/json",
  };

  if (noContentType) {
    headers = {};
  }

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  return headers;
}

export const API = (TOKEN) => {
  return {
    // HTTP Configurations
    GET_CONFIG: (overrideToken, additionalHeaders = {}) => {
      let headers;
      headers = setupRequestHeaders(false, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };
      return {
        method: GET,
        headers: headers,
      };
    },
    GET_CONFIG_WITH_BODY: (data, overrideToken, additionalHeaders = {}) => {
      let headers;
      headers = setupRequestHeaders(false, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };
      return {
        method: GET,
        body: JSON.stringify(data),
        headers: headers,
      };
    },
    POST_FILE_CONFIG: (data, overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(true, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };
      return {
        method: POST,
        body: data,
        headers: headers,
      };
    },
    POST_CONFIG: (data, overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(false, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };

      return {
        method: POST,
        body: JSON.stringify(data),
        headers,
      };
    },
    PUT_FILE_CONFIG: (data, overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(true, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };

      return {
        method: PUT,
        body: data,
        headers: headers,
      };
    },
    PUT_CONFIG: (data, overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(false, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };
      return {
        method: PUT,
        body: JSON.stringify(data),
        headers: headers,
      };
    },
    PATCH_FILE_CONFIG: (data, overrideToken) => {
      // authorization token
      var headers = setupRequestHeaders(true, TOKEN, overrideToken);
      return {
        method: PATCH,
        body: data,
        headers: headers,
      };
    },
    PATCH_CONFIG: (data, overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(false, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };

      return {
        method: PATCH,
        body: JSON.stringify(data),
        headers: headers,
      };
    },
    DELETE_CONFIG: (overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(null, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };
      return {
        method: DELETE,
        headers: headers,
      };
    },
    DELETE_CONFIG_WITH_BODY: (data, overrideToken, additionalHeaders = {}) => {
      // authorization token
      var headers = setupRequestHeaders(null, TOKEN, overrideToken);
      headers = { ...headers, ...additionalHeaders };
      return {
        method: DELETE,
        body: JSON.stringify(data),
        headers: headers,
      };
    },
  };
};

/***
 * Creates the API file
 */
const createAPI = ({
  routes,
  authTokenName,
  apiRoot,
  frontendUrl,
  extraRoutes,
}) => {
  // const PRODUCTION_SITE = getProdSite();
  const TOKEN = authTokenName;
  const BASE_URL = getApiRoot({
    PRODUCTION_SITE: apiRoot.production,
    STAGING_SITE: apiRoot.staging,
    LOCALHOST: apiRoot.dev,
  });

  let curApi = API(TOKEN);
  let curRoutes = routes(BASE_URL);
  let api = { ...curApi, ...curRoutes };
  if (extraRoutes) {
    let curExtraRoutes = extraRoutes(BASE_URL);
    api = { ...api, ...curExtraRoutes };
  }

  return api;
};

export default createAPI;
