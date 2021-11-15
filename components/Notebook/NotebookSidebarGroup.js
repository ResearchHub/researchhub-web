import Loader from "~/components/Loader/Loader";
import NotebookSidebarEntry from "~/components/Notebook/NotebookSidebarEntry";
import PropTypes from "prop-types";
import colors from "~/config/themes/colors";
import icons, { UpIcon, DownIcon } from "~/config/themes/icons";
import { MessageActions } from "~/redux/message";
import { NOTE_GROUPS } from "./config/notebookConstants";
import { captureError } from "~/config/utils/error";
import { connect } from "react-redux";
import { createNewNote } from "~/config/fetch";
import { css, StyleSheet } from "aphrodite";
import { isOrgMember } from "~/components/Org/utils/orgHelper";
import { useState } from "react";

const NotebookSidebarGroup = ({
  currentNoteId,
  currentOrg,
  groupKey,
  notes,
  redirectToNote,
  setMessage,
  showMessage,
  titles,
  user,
}) => {
  const [createNoteIsLoading, setCreateNoteIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const _isOrgMember = isOrgMember({ user, org: currentOrg });

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
      captureError({
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
    _isOrgMember;

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.groupHead)}>
        <div
          onClick={() => setIsHidden(!isHidden)}
          className={css(styles.title)}
        >
          {groupKey}{" "}
          {isHidden ? (
            <UpIcon withAnimation={false} />
          ) : (
            <DownIcon withAnimation={false} />
          )}
        </div>
        {allowedToCreateNote && (
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
      {notes.length === 0 && (
        <div
          className={css(styles.newNoteButton)}
          onClick={() => handleCreateNewNote(groupKey)}
        >
          <span className={css(styles.plusIcon)}>{icons.plus}</span> Create new
          note
        </div>
      )}
      {!isHidden &&
        notes.map((note) => {
          return (
            <NotebookSidebarEntry
              currentNoteId={currentNoteId}
              currentOrg={currentOrg}
              groupKey={groupKey}
              key={note.id}
              note={note}
              redirectToNote={redirectToNote}
              showOptions={_isOrgMember}
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
  newNoteButton: {
    color: colors.PURPLE(1),
    fontSize: 14,
    fontWeight: 500,
    padding: "20px 40px 20px 20px",
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
    ":last-child": {
      borderBottom: `1px solid ${colors.GREY(0.3)}`,
    },
  },
  plusIcon: {
    fontSize: 17,
    marginRight: 5,
  },
  groupHead: {
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontWeight: 500,
    padding: "20px 10px 20px 20px",
    userSelect: "none",
    alignItems: "center",
    ":hover .actionButton": {
      opacity: 1,
    },
  },
  title: {
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: 600,
    color: colors.BLACK(0.5),
    ":hover": {
      color: colors.PURPLE(1),
    },
  },
  new: {
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
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(NotebookSidebarGroup);
