export const AUTH_TOKEN = "researchhub.auth.token";
export const UPVOTE = "upvote";
export const DOWNVOTE = "downvote";

export const UPVOTE_ENUM = 1;
export const DOWNVOTE_ENUM = 2;

export function nameToUrl(name) {
  let arr = name.split(" ");
  return arr.length > 1 ? arr.join("-").toLowerCase() : name.toLowerCase();
}
