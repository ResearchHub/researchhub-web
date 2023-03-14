import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import colors from "../themes/colors";
import { getNestedValue } from "./misc";

export function getCurrentUserLegacy(storeState) {
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

export function createEditorSummary(hubs) {
  return (hubs ?? []).map((hub, i) => {
    const { name, slug } = hub.source;
    return (
      <Link
        key={`hub-${i}`}
        href={"/hubs/[slug]"}
        as={`/hubs/${slug}`}
        className={css(styles.hubLinkTag)}
      >
        {i > 0 && ", "}
        {name}
      </Link>
    );
  });
}

const styles = StyleSheet.create({
  hubLinkTag: {
    textDecoration: "unset",
    cursor: "pointer",
    color: "unset",
    textDecoration: "underline",
    fontWeight: 500,
    fontSize: 14,
    textTransform: "capitalize",
    // color: colors.BLACK(0.8),
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

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
