import { useState } from "react";
import PropTypes from "prop-types";
import SidebarSectionContent from "~/components/Notebook/SidebarSectionContent";
import { css, StyleSheet } from "aphrodite";
import { createNewNote } from "~/config/fetch";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";
import { NOTE_GROUPS } from "./config/notebookConstants";
import { captureError } from "~/config/utils/error";

const NotebookSidebarGroup = ({
  groupKey,
  availGroups,
  notes,
  titles,
  currentNoteId,
  currentOrg,
  onNoteCreate,
  onNoteDelete,
  refetchTemplates,
  setRefetchTemplates,
}) => {
  const [createNoteIsLoading, setCreateNoteIsLoading] = useState(false);

  const handleCreateNewNote = async (groupKey) => {
    setCreateNoteIsLoading(true);

    try {
      const note = await createNewNote({ orgSlug: currentOrg.slug, grouping: groupKey });

      // TODO: Remove once Leo adds this to endpoint
      note.access = groupKey;
      onNoteCreate(note);
    } catch (error) {
      captureError({
        error,
        msg: "Failed to create note",
        data: { currentNoteId, groupKey, orgSlug: currentOrg.slug },
      });
    } finally {
      setCreateNoteIsLoading(false);
    }
  };

  const allowCreateNote = [NOTE_GROUPS.WORKSPACE, NOTE_GROUPS.PRIVATE].includes(
    groupKey
  );

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.groupHead)}>
        <div className={css(styles.title)}>{groupKey}</div>
        {allowCreateNote && (
          <div className={css(styles.new)}>
            {createNoteIsLoading ? (
              <Loader type="clip" size={23} />
            ) : (
              <div
                className={css(styles.actionButton)}
                onClick={() => handleCreateNewNote(groupKey)}
              >
                {icons.plus}
              </div>
            )}
        </div>
        )}
      </div>
      {notes.map((note) => (
        <SidebarSectionContent
          key={note.id}
          currentOrg={currentOrg}
          currentNoteId={currentNoteId}
          noteId={note.id.toString()}
          onNoteCreate={onNoteCreate}
          onNoteDelete={onNoteDelete}
          refetchTemplates={refetchTemplates}
          setRefetchTemplates={setRefetchTemplates}
          title={titles[note.id]}
        />
      ))}
    </div>
  );
};

NotebookSidebarGroup.propTypes = {
  groupKey: PropTypes.oneOf([NOTE_GROUPS.WORKSPACE, NOTE_GROUPS.SHARED, NOTE_GROUPS.PRIVATE]),
  notes: PropTypes.array,
};

const styles = StyleSheet.create({
  groupHead: {
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontWeight: 500,
    padding: "20px 10px 20px 20px",
    userSelect: "none",
    alignItems: "center",
  },
  title: {
    textTransform: "capitalize",
    fontSize: 14,
    color: colors.BLACK(0.5),
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
  },
});

export default NotebookSidebarGroup;