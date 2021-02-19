import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

import PaperJournalTag from "~/components/Paper/PaperJournalTag";

// Config
import icons from "~/config/themes/icons";
import colors, { bannerColor } from "~/config/themes/colors";
import {
  getJournalFromURL,
  capitalize,
  getJournalImagePath,
  formatJournalName,
} from "~/config/utils";

const JournalCard = (props) => {
  const { paper } = props;
  const { external_source, url } = paper;
  const [imgExists, setImgExists] = useState(true);

  const externalSource = external_source
    ? external_source
    : getJournalFromURL(url);
  const journal = formatJournalName(externalSource);

  const journalImageProps = () => ({
    src: journal && getJournalImagePath(journal),
    className: css(styles.image),
    onError: () => setImgExists(false),
  });

  return (
    <a
      className={css(styles.container)}
      href={url}
      target="_blank"
      rel="noreferrer noopener"
    >
      {imgExists && <img {...journalImageProps()} />}
      <div
        className={
          css(styles.column, imgExists && styles.marginLeft) + " clamp1"
        }
      >
        {externalSource && (
          <span className={css(styles.journal)}>
            {capitalize(externalSource)}
          </span>
        )}
        {url && <span className={css(styles.url) + " clamp1 url"}>{url}</span>}
      </div>
    </a>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 15px 10px 20px",
    borderLeft: `3px solid #FFF`,
    textDecoration: "unset",
    color: "unset",
    transition: "all ease-in-out 0.2s",
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":hover .url": {
      color: colors.BLUE(),
      textDecoration: "underline",
    },
  },
  image: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: "#EAEAEA",
    border: "1px solid #ededed",
  },
  journal: {
    fontSize: 16,
    color: colors.BLACK(1),
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    lineHeight: 1.3,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    boxSizing: "border-box",
    textOverflow: "ellipsis",
  },
  url: {
    fontSize: 14,
    width: "100%",
    textOverflow: "ellipsis",
    paddingTop: 5,
    color: colors.BLUE(),
    ":hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  marginLeft: {
    marginLeft: 15,
  },
});

export default JournalCard;
