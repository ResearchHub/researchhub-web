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
export const ORCID_REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://researchhub.com/orcid/"
    : "http://localhost:8000/orcid/login/";

export function nameToUrl(name) {
  let arr = name.split(" ");
  return arr.length > 1 ? arr.join("-").toLowerCase() : name.toLowerCase();
}
