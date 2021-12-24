import Loader from "~/components/Loader/Loader";
import NotebookSidebarEntry from "~/components/Notebook/NotebookSidebarEntry";
import PropTypes from "prop-types";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { MessageActions } from "~/redux/message";
import { NOTE_GROUPS } from "./config/notebookConstants";
import { captureEvent } from "~/config/utils/events";
import { connect } from "react-redux";
import { createNewNote } from "~/config/fetch";
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";

const NotebookSidebarGroup = ({
  currentNoteId,
  currentOrg,
  groupKey,
  isOrgMember,
  notes,
  redirectToNote,
  setMessage,
  showMessage,
  titles,
}) => {
  const [createNoteIsLoading, setCreateNoteIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleCreateNewNote = async (groupKey) => {
    setCreateNoteIsLoading(true);

    try {
      const note = await createNewNote({
        orgSlug: currentOrg.slug,
        grouping: groupKey,
      });

      redirectToNote(note);
      setIsHidden(false);
    } catch (error) {
      setMessage("You do not have permission to create note");
      showMessage({ show: true, error: true });
      captureEvent({
        error,
        msg: "Failed to create note",
        data: { groupKey, orgSlug: currentOrg.slug },
      });
    } finally {
      setCreateNoteIsLoading(false);
    }
  };

  const allowedToCreateNote =
    [NOTE_GROUPS.WORKSPACE, NOTE_GROUPS.PRIVATE].includes(groupKey) &&
    isOrgMember;
  const isNotesEmpty = notes.length === 0;

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.groupHead)}>
        <div
          onClick={() => setIsHidden(!isHidden)}
          className={css(styles.title)}
        >
          {groupKey}
        </div>
        {allowedToCreateNote && !isNotesEmpty && (
          <div className={css(styles.new)}>
            {createNoteIsLoading ? (
              <Loader type="clip" size={23} />
            ) : (
              <div
                className={css(styles.actionButton) + " actionButton"}
                onClick={() => handleCreateNewNote(groupKey)}
              >
                {icons.plus}
              </div>
            )}
          </div>
        )}
      </div>
      {isNotesEmpty && (
        <div
          className={css(styles.newNoteButton)}
          onClick={() => handleCreateNewNote(groupKey)}
        >
          <span className={css(styles.plusIcon)}>{icons.plus}</span>
          Create new note
        </div>
      )}
      {!isHidden &&
        notes.map((note) => {
          return (
            <NotebookSidebarEntry
              currentNoteId={currentNoteId}
              currentOrg={currentOrg}
              groupKey={groupKey}
              isOrgMember={isOrgMember}
              key={note.id}
              note={note}
              redirectToNote={redirectToNote}
              title={titles[note.id]}
              titles={titles}
            />
          );
        })}
    </div>
  );
};

NotebookSidebarGroup.propTypes = {
  groupKey: PropTypes.oneOf([
    NOTE_GROUPS.WORKSPACE,
    NOTE_GROUPS.SHARED,
    NOTE_GROUPS.PRIVATE,
  ]),
  notes: PropTypes.array,
};

const styles = StyleSheet.create({
  container: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
    padding: "10px 0px",
  },
  groupHead: {
    alignItems: "center",
    color: colors.BLACK(),
    display: "flex",
    fontWeight: 500,
    padding: "10px 10px 10px 15px",
    userSelect: "none",
    ":hover .actionButton": {
      opacity: 1,
    },
  },
  title: {
    borderRadius: 4,
    color: colors.BLACK(0.4),
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1.1,
    padding: 5,
    textTransform: "capitalize",
    ":hover": {
      background: colors.GREY(0.3),
    },
  },
  new: {
    cursor: "pointer",
    marginLeft: "auto",
  },
  actionButton: {
    alignItems: "center",
    background: colors.LIGHT_GREY(),
    color: colors.PURPLE(1),
    border: "1px solid #ddd",
    borderRadius: "50%",
    display: "flex",
    fontSize: 16,
    height: 25,
    width: 25,
    justifyContent: "center",
    transition: "all ease-in-out 0.1s",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  newNoteButton: {
    color: colors.PURPLE(1),
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    padding: "10px 40px 10px 20px",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  plusIcon: {
    fontSize: 15,
    marginRight: 10,
  },
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(NotebookSidebarGroup);
