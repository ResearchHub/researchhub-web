import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Components
import ProjectCard from "./Projects/ProjectCard";

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
