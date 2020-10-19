import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Redux
import { ModalActions } from "~/redux/modals";

// Components
import ProjectCard from "./Projects/ProjectCard";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import ManageFeaturedWorkModal from "~/components/modal/ManageFeaturedWorkModal";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const UserOverview = (props) => {
  function openManageFeaturedWorkModal(e) {
    props.openManageFeaturedWorkModal(true);
  }

  function renderFeaturedWorks() {
    if (props.author.userOverview && props.author.userOverview.length) {
      let isSolo = props.author.userOverview.length === 1;

      return props.author.userOverview.map((featuredWork, i) => {
        let isRegular = featuredWork && featuredWork.paper_type === "REGULAR";

        if (isRegular) {
          return (
            <PaperEntryCard
              paper={featuredWork}
              key={`userfeaturedWork-${featuredWork.id}`}
              style={[styles.paperEntryCard, isSolo && styles.solo]}
            />
          );
        }
        return (
          <ProjectCard
            paper={featuredWork}
            key={`userfeaturedWork-${featuredWork.id}`}
            style={[styles.paperEntryCard, isSolo && styles.solo]}
          />
        );
      });
    }
    return null;
  }

  return (
    <Fragment>
      <div className={css(styles.root)}>
        <ManageFeaturedWorkModal
          featured={props.author.userOverview || []}
          authoredPapers={props.author.authoredPapers.papers || []}
          projects={props.author.userProjects.projects || []}
        />
        <div
          className={css(styles.editButton)}
          onClick={openManageFeaturedWorkModal}
        >
          <i className={css(styles.icon) + " fal fa-tasks-alt"} />
          Manage Featured Work
          {/* {icons.pencil} */}
        </div>
        {renderFeaturedWorks()}
      </div>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: -40,
    right: 0,
    cursor: "pointer",
    fontSize: 14,
    color: colors.BLACK(0.6),
    ":hover": {
      color: colors.BLACK(),
    },
  },
  icon: {
    marginRight: 5,
  },
  paperEntryCard: {
    border: 0,
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 24,
    width: "100%",
    minWidth: "100%",
  },
  solo: {
    border: "none",
  },
  tabMeta: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "#fff",
    border: "1.5px solid #F0F0F0",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: 50,
    paddingTop: 24,
    "@media only screen and (max-width: 767px)": {
      padding: 20,
    },
  },
  title: {
    fontWeight: 500,
    textTransform: "capitalize",
    marginTop: 0,
    marginBottom: 16,
    // fontSize: 32,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
  author: state.author,
  modals: state.modals,
});

const mapDispatchToProps = {
  openManageFeaturedWorkModal: ModalActions.openManageFeaturedWorkModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserOverview);
