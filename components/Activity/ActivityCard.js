import { isNullOrUndefined } from "~/config/utils/nullchecks.ts";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Ripples from "react-ripples";

// Components
import TextEditor from "~/components/TextEditor"; // QuillTextEditor
import ActivityHeader from "./ActivityHeader";
import ActivityBody from "./ActivityBody";
import { TimeStamp } from "~/components/Notifications/NotificationHelpers";
import HubTag from "~/components/Hubs/HubTag";

import colors from "~/config/themes/colors";

// const BLACK_LIST_TYPES = {
//   CURATOR: true,
// };

const ActivityCard = (props) => {
  // TODO: calvinhlee - need to capture posts as well
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);

  const { activity, last } = props;

  // const {
  //   paper,
  //   source,
  //   created_date: createdDate,
  //   contribution_type: contributionType,
  // } = activity;

  // const { id: paperId, slug: paperName, hubs } = paper;
  // const { id: sourceID, paper_title: sourcePaperTitle } = source;

  const {
    contribution_type: contributionType,
    created_date: createdDate,
    id: paperId /* TODO: briansantoso - rename to be inclusive to posts*/,
    source,
  } = activity;

  const {
    hubs,
    id: sourceID,
    paper_title: sourcePaperTitle,
    slug: paperName,
  } = source;

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
  const resolvedPaperID = paperId || sourceID;
  const resolvedPaperName = paperName || sourcePaperTitle || "";
  if (isNullOrUndefined(resolvedPaperID)) return null;
  return (
    <Link
      href={"/paper/[paperId]/[paperName]"}
      as={`/paper/${resolvedPaperID}/${resolvedPaperName}`}
    >
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
