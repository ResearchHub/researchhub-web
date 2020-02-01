export const AUTH_TOKEN = "researchhub.auth.token";
export const UPVOTE = "upvote";
export const DOWNVOTE = "downvote";

export const UPVOTE_ENUM = 1;
export const DOWNVOTE_ENUM = 2;

export const GOOGLE_CLIENT_ID =
  process.env.NODE_ENV === "production"
    ? "192509748493-3enrmve4vlikpff88lujns7b4d72hgbg.apps.googleusercontent.com"
    : "192509748493-amjlt30mbpo9lq5gppn7bfd5c52i0ioe.apps.googleusercontent.com";

export const ORCID_CLIENT_ID = "APP-JRYHYFMMJTSPBLCP";
export const ORCID_REDIRECT_URI = setOrcidRedirect();

function setOrcidRedirect() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8000/api/auth/orcid/login/callback/"; // development
  } else if (process.env.NODE_ENV === "production") {
    return "https://backend.researchhub.com/api/auth/orcid/login/callback/";
  } else {
    ("https://staging-backend.researchhub.com/api/auth/orcid/login/callback/");
  }
}

export function nameToUrl(name) {
  let arr = name.split(" ");
  return arr.length > 1 ? arr.join("-").toLowerCase() : name.toLowerCase();
}
