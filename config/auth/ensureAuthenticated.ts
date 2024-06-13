import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

interface Props {
  nextPageContext: any;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: any;
  redirectResponse?: any;
  errorResponse?: any;
}

export default async function ensureAuthenticated({
  nextPageContext,
}: Props): Promise<AuthResponse> {
  const cookies = nookies.get(nextPageContext);
  const authToken = cookies[AUTH_TOKEN];

  let authResponse: Response;
  try {
    authResponse = await fetch(API.USER({}), API.GET_CONFIG(authToken))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
  } catch (error: any) {
    const isAuthError =
      error?.response?.status === 401 || error?.response?.status === 403;

    if (isAuthError) {
      return {
        isAuthenticated: false,
        user: null,
        redirectResponse: {
          redirect: {
            destination: `/login?redirect=${nextPageContext.req.url}`,
            permanent: false,
          },
        },
      };
    } else {
      return {
        isAuthenticated: false,
        user: null,
        errorResponse: {
          props: {
            errorCode: 500,
          },
        },
      };
    }
  }

  // There are two signals users is logged out:
  // 1. /user endpoint throws a 401 (above scenario)
  // 2. /user endpoint returns empty result
  // @ts-ignore
  const userIsLoggedOut = authResponse.results.length === 0;
  if (userIsLoggedOut) {
    return {
      isAuthenticated: false,
      user: null,
      redirectResponse: {
        redirect: {
          destination: `/login?redirect=${nextPageContext.req.url}`,
          permanent: false,
        },
      },
    };
  }

  // User is logged in
  return {
    isAuthenticated: true,
    // @ts-ignore
    user: authResponse.results[0],
  };
}
