import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import Ripples from "react-ripples";

// Components
import ProjectCard from "./Projects/ProjectCard";
import Loader from "~/components/Loader/Loader";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";

// Redux
import { TransactionActions } from "~/redux/transaction";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const UserProjects = (props) => {
  let projects = props.author.userProjects.projects;

  return projects.map((project, i) => {
    return (
      <ProjectCard
        paper={project}
        key={`userProject-${project.id}`}
        style={[styles.paperEntryCard]}
      />
    );
  });
};

const styles = StyleSheet.create({
  paperEntryCard: {
    border: 0,
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 24,
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(
  mapStateToProps,
  null
)(UserProjects);
