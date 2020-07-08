export const COMPANY_NAME = "ResearchHub";

export const AUTH_TOKEN = "researchhub.auth.token";
export const UPVOTE = "upvote";
export const DOWNVOTE = "downvote";

export const UPVOTE_ENUM = 1;
export const DOWNVOTE_ENUM = 2;

export const DIGEST_FREQUENCY = {
  Daily: 1440,
  "Every 3 Hours": 180,
  Weekly: 10080,
};

export const GOOGLE_CLIENT_ID =
  process.env.NODE_ENV === "production"
    ? "192509748493-3enrmve4vlikpff88lujns7b4d72hgbg.apps.googleusercontent.com"
    : "708688924921-aqjof10cjpd7n3ie33kltloiughp14vh.apps.googleusercontent.com";

export const ORCID_CLIENT_ID = "APP-28GINQJPUWS3ZTW1";
export const ORCID_REDIRECT_URI = setOrcidRedirect();

function setOrcidRedirect() {
  if (process.env.REACT_APP_ENV === "staging") {
    return "https://staging-backend.researchhub.com/api/auth/orcid/login/callback/";
  } else if (process.env.NODE_ENV === "production") {
    return "https://backend.researchhub.com/api/auth/orcid/login/callback/";
  } else {
    return "http://localhost:8000/api/auth/orcid/login/callback/";
  }
}

export const orcidMethods = {
  CONNECT: "connect",
  LOGIN: "login",
};

export const ORCID_JWKS_URI = "https://orcid.org/oauth/jwks";
export const ORCID_KID =
  "production-orcid-org-7hdmdswarosg3gjujo8agwtazgkp1ojs";

export const METATAG_DEFAULT_IMAGE_URL =
  "https://www.researchhub.com/static/background/facebook-og.jpg";

export function nameToUrl(name) {
  return encodeURIComponent(name);
}

export const WEB3_INFURA_PROJECT_ID = "a7ccde5d021c48e1a0525dfd6e58490f";
export const MAINNET_CHAIN_ID = "1";
export const RINKEBY_CHAIN_ID = "4";
