import Cookies from "js-cookie";
import { AUTH_TOKEN } from "../constants";

export const getEnvPrefix = () => {
  if (process.env.REACT_APP_ENV === "staging") {
    return "stg";
  } else if (process.env.NODE_ENV === "production") {
    return "prod";
  } else {
    return "local";
  }
};

export const getParentDomain = () => {
  if (process.env.REACT_APP_ENV === "staging") {
    return ".staging.researchhub.com";
  } else if (process.env.NODE_ENV === "production") {
    return ".researchhub.com";
  } else {
    return undefined;
  }
};

export const getSharedCookieOptions = (expiryDays = 14) => {
  const options = {
    expires: expiryDays,
    path: "/",
  };

  const parentDomain = getParentDomain();
  if (parentDomain) {
    options.domain = parentDomain;
    options.secure = true;
    options.sameSite = "lax";
  }

  return options;
};

export const ENV_AUTH_TOKEN = `${getEnvPrefix()}.${AUTH_TOKEN}`;

export const getAuthToken = () => {
  const envToken = Cookies.get(ENV_AUTH_TOKEN);
  if (envToken) {
    Cookies.remove(AUTH_TOKEN);
    return envToken;
  }

  const currentToken = Cookies.get(AUTH_TOKEN);
  if (currentToken) {
    Cookies.set(ENV_AUTH_TOKEN, currentToken, getSharedCookieOptions());
    Cookies.remove(AUTH_TOKEN);
    return currentToken;
  }

  return null;
};
