// NPM Modules
import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Component
import HubTag from "~/components/Hubs/HubTag";

import { formatPublishedDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";
import colors, { cardColors, formColors } from "~/config/themes/colors";
import icons from "../../../../config/themes/icons";
import { formatDate } from "../../../../config/utils";

const DraggableProjectCard = (props) => {
  const { active, index, onClick, onEditCallback } = props;
  const [hover, setHover] = useState(false);
  const paper = props.data;

  function formatTitle() {
    return paper.title;
  }

  function formatDate() {
    if (paper.paper_publish_date) {
      return formatPublishedDate(transformDate(paper.paper_publish_date));
    } else if (paper.uploaded_date) {
      return `Submitted: ${formatPublishedDate(
        transformDate(paper.uploaded_date),
        true
      )}`;
    }
  }

  function onMouseEnter() {
    !hover && setHover(true);
  }

  function onMouseLeave() {
    hover && setHover(false);
  }

  function renderHubTag() {
    const hubs = paper.hubs;
    if (hubs && hubs.length > 0) {
      return hubs
        .slice(0, 2)
        .map(
          (tag, index) =>
            tag &&
            index < 3 && (
              <HubTag
                key={`hub_${index}`}
                tag={tag}
                last={index === hubs.length - 1}
                gray={true}
                labelStyle={styles.hubLabel}
                removeLink={true}
              />
            )
        );
    }
  }

  function handleClick() {
    onClick && onClick(paper, index);
  }

  return (
    <Ripples
      className={css(styles.root, props.active && styles.activeRoot)}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={css(styles.checkbox, props.active && styles.active)}>
        {icons.checkmark}
      </div>
      <div className={css(styles.paper)}>
        <div className={css(styles.paperTitle)}>{formatTitle()}</div>
        <div className={css(styles.paperData)}>{formatDate()}</div>
        <div className={css(styles.paperHubs)}>{renderHubTag()}</div>
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "100%",
    border: `1px solid ${cardColors.BORDER}`,
    background: cardColors.BACKGROUND,
    padding: "15px 20px",
    borderRadius: 4,
    marginBottom: 10,
    boxSizing: "border-box",
    cursor: "pointer",
    ":hover": {
      borderColor: colors.BLUE(),
      filter: "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.25))",
    },
  },
  activeRoot: {
    filter: "drop-shadow(0px 0.5px 0px rgba(0, 0, 0, 0.25))",
  },
  checkbox: {
    height: 26,
    width: 26,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: `1px solid ${formColors.BORDER}`,
    marginRight: 15,
    color: formColors.SELECT,
    cursor: "pointer",
    ":hover": {
      background: colors.BLUE(),
    },
  },
  active: {
    background: colors.BLUE(),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  paperTitle: {
    fontSize: 16,
    color: colors.BLACK(),
    width: "100%",
    marginBottom: 10,
  },
  paperData: {
    fontSize: 14,
    color: colors.BLACK(0.5),
    width: "100%",
    marginBottom: 10,
  },
  paperHubs: {
    marginTop: 5,
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default DraggableProjectCard;
