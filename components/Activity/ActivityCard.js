import { isNullOrUndefined } from "~/config/utils/nullchecks.ts";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ripples from "react-ripples";

// Components
import ActivityHeader from "./ActivityHeader";
import ActivityBody from "./ActivityBody";
import { TimeStamp } from "~/components/Notifications/NotificationHelpers";
import HubTag from "~/components/Hubs/HubTag";

import colors from "~/config/themes/colors";

// const BLACK_LIST_TYPES = {
//   CURATOR: true,
// };

export const getActivityMetadata = (activity) => {
  const {
    contribution_type: contributionType,
    source,
    unified_document: { document_type: sourceType, documents: documents },
  } = activity;

  let href, hrefAs;
  let postId, postTitle, postSlug;
  let docs = documents;

  if (Array.isArray(documents)) {
    docs = documents[0];
  }

  switch (contributionType) {
    case "SUBMITTER":
      postId = source.id;
      postSlug = source.slug;
      // If it's a submission, then the post title depends on whether it is a paper of discusison,
      // so handle in next switch.
      break;
    case "COMMENTER":
      postId = docs.id;
      postTitle = docs.title;
      postSlug = docs.slug;
      break;
    case "SUPPORTER":
      if (docs) {
        postId = docs.id;
        postTitle = docs.title;
        postSlug = docs.slug;
      }
  }

  switch (sourceType) {
    case "PAPER":
      href = "/paper/[paperId]/[paperName]";
      postTitle = postTitle ? postTitle : source.paper_title;
      hrefAs = `/paper/${postId}/${postSlug}`;
      break;
    case "DISCUSSION":
      href = "/post/[documentId]/[title]";
      postTitle = postTitle ? postTitle : source.title;
      hrefAs = `/post/${postId}/${postSlug}`;
      break;
    case "HYPOTHESIS":
      href = "/hypothesis/[documentId]/[title]";
      postTitle = postTitle ? postTitle : source.title;
      hrefAs = `/hypothesis/${postId}/${postSlug}`;
      break;
    default:
      href = "";
      hrefAs = "";
      break;
  }

  return {
    contributionType,
    href,
    hrefAs,
    postId,
    postTitle,
    sourceType,
  };
};

const ActivityCard = (props) => {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);

  const { activity, last } = props;

  const {
    contribution_type: contributionType,
    created_date: createdDate,
    unified_document: unifiedDocument,
    source,
  } = activity;

  const { hubs } = unifiedDocument;

  useEffect(() => {
    checkIsRemoved();
  });

  function checkIsRemoved() {
    if (contributionType === "COMMENTER") {
      setIsHidden(source["is_removed"]);
    } else {
      setIsHidden(false);
    }
  }

  const formatProps = (type) => {
    switch (type) {
      case "timestamp":
        return {
          date: createdDate,
          removeIcon: true,
        };
      case "hub":
        const hub = hubs && hubs.length && hubs[0]; // we only show one hub tag (first)
        return {
          tag: hub,
          last: true,
        };
    }
  };

  const shouldRenderTimeStamp = () => {
    let yesterday = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
    let date = new Date(createdDate);

    if (date < yesterday) {
      return false;
    }

    return true;
  };

  if (isHidden) return null;

  const { href, hrefAs, postId } = getActivityMetadata(activity);

  if (isNullOrUndefined(postId)) return null;

  return (
    <Link href={href} as={hrefAs}>
      <a className={css(styles.link)}>
        <Ripples className={css(styles.root)}>
          <ActivityHeader {...props} />
          <ActivityBody {...props} />
          <div className={css(styles.row, last && styles.noBorderBottom)}>
            {shouldRenderTimeStamp() ? (
              <TimeStamp {...formatProps("timestamp")} />
            ) : null}
            <div className={css(styles.hubTag)}>
              {hubs ? (
                <HubTag {...formatProps("hub")} noHubName={true} />
              ) : null}
            </div>
          </div>
        </Ripples>
      </a>
    </Link>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "10px 20px 0px 17px", // 3px removed from left to offset border hover
    boxSizing: "border-box",
    width: "100%",
    borderLeft: `3px solid #FFF`,
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      transition: "all ease-in-out 0.2s",
    },
  },
  link: {
    textDecoration: "unset",
    color: "unset",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
    borderBottom: `1px solid ${colors.BLACK(0.1)}`,
  },
  hubTag: {
    marginLeft: "auto",
  },
  noBorderBottom: {
    borderBottom: "none",
  },
});

export default ActivityCard;