import PropTypes from "prop-types";
import SidebarSectionContent from "~/components/Notebook/SidebarSectionContent";
import { css, StyleSheet } from "aphrodite";

const NotebookSidebarGroup = ({ groupType, notes }) => {
  {notes.map((note) => {
    const noteId = note.id.toString();

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.title)}>{groupType}</div>
        {children}
      </div>
    );
  })}
}

NotebookSidebarGroup.propTypes = {
  groupType: PropTypes.oneOf(["WORKSPACE", "SHARED", "PRIVATE"]),
  notes: PropTypes.array,
}

const styles = StyleSheet.create({
  container: {

  },
  title: {

  }
});

export default NotebookSidebarGroup;
