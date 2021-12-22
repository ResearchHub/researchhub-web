import { getNestedValue } from "./misc";

export function getCurrentUser(storeState) {
  return getNestedValue(storeState, ["auth", "user"], null);
}

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

export function createEduSummary(author = {}) {
  const { education } = author;
  let summary = "";

  if (education?.length > 0) {
    let school = education.filter((school) => school.is_public);
    if (school?.length > 0) {
      summary += school[0].summary;
    }
  }

  return summary;
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
