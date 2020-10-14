import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";

// Components
import ProjectCard from "./Projects/ProjectCard";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import ManageFeaturedWorkModal from "~/components/modal/ManageFeaturedWorkModal";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
// import { formatPublishedDate, formatPaperSlug } from "~/config/utils";
// import { transformDate } from "~/redux/utils";
// import { PaperActions } from "~/redux/paper";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const UserOverview = (props) => {
  let projects = props.author.userProjects.projects;

  const [featuredWorks, setFeaturedWorks] = useState(setInitialState() || []);

  // ComponentDidMount // Update
  useEffect(() => {
    setFeaturedWorks(setInitialState());
  }, [props.author.userProjects.projects, props.author.authoredPapers.paper]);

  function setInitialState() {
    const { userProjects, authoredPapers } = props.author;
    let seen = {};
    return [...authoredPapers.papers, ...userProjects.projects].map((paper) => {
      if (!seen[paper.id]) {
        seen[paper.id] = true;
        return paper;
      }
    });
  }

  function openManageFeaturedWorkModal(e) {
    console.log("called modal");

    props.openManageFeaturedWorkModal(true);
  }

  function renderFeaturedWorks() {
    if (featuredWorks && featuredWorks.length) {
      return featuredWorks.map((featuredWork, i) => {
        console.log("featuredWork", featuredWork);
        let isRegular = featuredWork && featuredWork.paper_type === "REGULAR";

        if (isRegular) {
          return (
            <PaperEntryCard
              paper={featuredWork}
              key={`userfeaturedWork-${featuredWork.id}`}
              style={[styles.paperEntryCard]}
            />
          );
        }
        return (
          <ProjectCard
            paper={featuredWork}
            key={`userfeaturedWork-${featuredWork.id}`}
            style={[styles.paperEntryCard]}
          />
        );
      });
    }
    return null;
  }

  return (
    <div className={css(styles.root)}>
      <ManageFeaturedWorkModal card={featuredWorks} />
      <div
        className={css(styles.editButton)}
        onClick={openManageFeaturedWorkModal}
      >
        {icons.pencil}
      </div>
      {renderFeaturedWorks()}
    </div>
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
