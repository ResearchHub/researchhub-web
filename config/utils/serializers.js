import { doesNotExist, getNestedValue } from "./index";

export function createUserSummary(author = {}) {
  const { headline, education } = author;
  const space = " | ";

  let userSummary = "";

  if (education && education.length) {
    let school = education.filter((school) => school.is_public);
    if (school.length) {
      userSummary += school[0].summary;
    }
  }

  if (headline && headline.isPublic) {
    let title = headline.title.trim();
    if (title.length) {
      userSummary += `${userSummary.length ? space : ""}` + headline.title;
    }
  }

  return userSummary;
}

export function createUsername({ created_by, createdBy }) {
  if (created_by) {
    const { first_name, last_name } = created_by.author_profile;
    return `${first_name} ${last_name}`;
  } else if (createdBy) {
    const { first_name, last_name } = createdBy.authorProfile;
    return `${first_name} ${last_name}`;
  }
  return "";
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getCurrentUser(storeState) {
  return getNestedValue(storeState, ["auth", "user"], null);
}

export function getCurrentUserReputation(storeState) {
  const currentUser = getCurrentUser(storeState);
  if (!doesNotExist(currentUser)) {
    return currentUser.reputation;
  }
  return null;
}

export function getMinimumReputation(storeState, key) {
  return (
    storeState.permission.success &&
    storeState.permission.data[key].minimumReputation
  );
}

export function getVoteType(vote) {
  return vote && vote.voteType;
}

export function toTitleCase(str) {
  if (typeof str === "string") {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  return str;
}

export function formatURL(url) {
  let http = "http://";
  let https = "https://";
  if (!url) {
    return;
  }
  if (url.startsWith(http)) {
    return url;
  }

  if (!url.startsWith(https)) {
    url = https + url;
  }
  return url;
}

export function formatPaperSlug(paperTitle) {
  if (paperTitle && typeof paperTitle === "string") {
    let slug = paperTitle.replace(/[^a-zA-Z ]/g, ""); // remove special characters regex
    slug = slug
      .split(" ")
      .filter((el) => el !== "")
      .join("-")
      .toLowerCase();
    return slug ? slug : "";
  }
  return "";
}
