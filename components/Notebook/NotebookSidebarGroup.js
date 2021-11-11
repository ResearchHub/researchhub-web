import { useState } from "react";
import PropTypes from "prop-types";
import NotebookSidebarEntry from "~/components/Notebook/NotebookSidebarEntry";
import { css, StyleSheet } from "aphrodite";
import { createNewNote } from "~/config/fetch";
import icons, { UpIcon, DownIcon } from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";
import { NOTE_GROUPS, PERMS } from "./config/notebookConstants";
import { captureError } from "~/config/utils/error";
import { isOrgMember } from "~/components/Org/utils/orgHelper";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { getUserNoteAccess } from "~/components/Notebook/utils/notePermissions";

const NotebookSidebarGroup = ({
  groupKey,
  availGroups,
  notes,
  titles,
  currentOrg,
  user,
  currentNoteId,
  onNoteCreate,
  onNoteDelete,
  onNotePermChange,
  showMessage,
  setMessage,
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

      onNoteCreate(note);
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
              key={note.id}
              note={note}
              titles={titles}
              groupKey={groupKey}
              currentOrg={currentOrg}
              onNoteCreate={onNoteCreate}
              currentNoteId={currentNoteId}
              onNoteDelete={onNoteDelete}
              title={titles[note.id]}
              showOptions={_isOrgMember}
              onNotePermChange={onNotePermChange}
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
