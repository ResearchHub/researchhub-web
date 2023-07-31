import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons";
import { Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";

// Config
import colors from "../config/themes/colors";

import { buildSlug } from "~/config/utils/buildSlug";

const HubSearchResult = ({ result, index, clearSearch }) => {
  let { id, meta, name, paper_count } = result;
  let { highlight } = meta;

  const parseHighlightText = (highlight, key) => {
    const text = highlight[key][0];
    const parts = text.split(/(<em>[^<]+<\/em>)/);
    return parts.map((part) => {
      if (part.includes("<em>")) {
        let replaced = part.replace("<em>", "");
        replaced = replaced.replace("</em>", "");
        return <span className={css(styles.highlight)}>{replaced}</span>;
      }
      return <span>{part}</span>;
    });
  };

  const formatCount = () => {
    return `${paper_count} Papers`;
  };

  const formatSlug = (name) => {
    return buildSlug(name);
  };

  const renderHeader = () => {
    return <div className={css(styles.section)}>Hubs</div>;
  };

  return (
    <Fragment>
      {index === 0 && renderHeader()}
      <Link
        href={"/hubs/[slug]"}
        as={`/hubs/${formatSlug(name)}`}
        className={css(styles.card)}
        onClick={() => clearSearch()}
      >
        <div className={css(styles.hubIcon)}>
          {<FontAwesomeIcon icon={faChartNetwork}></FontAwesomeIcon>}
        </div>
        <div className={css(styles.column)}>
          <div className={css(styles.mainText)}>
            {highlight ? parseHighlightText(meta.highlight, "name") : name}
          </div>
          <div className={css(styles.paperCount)}>{formatCount()}</div>
        </div>
      </Link>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  section: {
    width: "100%",
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 1.2,
    borderBottom: "1px solid #DAE0E6",
    paddingBottom: 10,
    cursor: "default",
  },
  card: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    width: "100%",
    padding: "15px 20px",
    textDecoration: "unset",
    color: "unset",
    ":hover": {
      backgroundColor: colors.INPUT_BACKGROUND_GREY,
    },
  },
  hubIcon: {
    marginRight: 15,
    color: colors.BLUE(),
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  mainText: {
    fontSize: 18,
    // fontSize: 16,
    color: colors.DARK_DESATURATED_BLUE(),
    fontWeight: "500",
    flexWrap: "wrap",
    wordBreak: "break-word",
    lineHeight: 1.6,
    textTransform: "capitalize",
    marginBottom: 5,
    "@media only screen and (max-width: 1080px)": {
      fontSize: 16,
    },
  },
  highlight: {
    backgroundColor: "#f6e653",
    padding: "2px 1px 2px 1px",
  },
  paperCount: {
    color: colors.DARK_GREYISH_BLUE2(),
    fontSize: 14,
    fontWeight: 400,
  },
});

export default HubSearchResult;
