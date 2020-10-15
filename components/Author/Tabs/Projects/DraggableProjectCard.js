// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Component
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import ProjectCard from "./ProjectCard";
import HubTag from "~/components/Hubs/HubTag";

// Redux
import { ModalActions } from "~/redux/modals";
import { BulletActions } from "~/redux/bullets";
import { LimitationsActions } from "~/redux/limitations";
import { MessageActions } from "~/redux/message";

import { formatPublishedDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";
import colors from "../../../../config/themes/colors";
import icons from "../../../../config/themes/icons";
import { formatDate } from "../../../../config/utils";

const DraggableProjectCard = (props) => {
  const { active, index, onClick, onEditCallback } = props;
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

  function renderHubTag() {
    const hubs = paper.hubs;
    if (hubs && hubs.length > 0) {
      return hubs.slice(0, 2).map(
        (tag, index) =>
          tag &&
          index < 3 && (
            <HubTag
              key={`hub_${index}`}
              tag={tag}
              last={index === hubs.length - 1}
              // gray={true}
              labelStyle={styles.hubLabel}
            />
          )
      );
    }
  }

  function handleClick() {
    console.log("caleld");
    onClick && onClick(paper.id, index);
  }

  return (
    <div
      className={css(styles.root, props.active && styles.activeRoot)}
      onClick={handleClick}
    >
      <div className={css(styles.checkbox, props.active && styles.active)}>
        {icons.checkmark}
      </div>
      <div className={css(styles.paper)}>
        <div className={css(styles.paperTitle)}>{formatTitle()}</div>
        <div className={css(styles.paperData)}>{formatDate()}</div>
        <div className={css(styles.paperHubs)}>{renderHubTag()}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "100%",
    border: "1px solid #F0F0F0",
    background: "#FAFAFA",
    padding: "15px 20px",
    borderRadius: 4,
    marginBottom: 10,
    boxSizing: "border-box",
    cursor: "pointer",
    ":hover": {
      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    },
  },
  activeRoot: {
    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
  },
  checkbox: {
    height: 26,
    width: 26,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #D7D7E3",
    marginRight: 15,
    color: "#FAFAFA",
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
