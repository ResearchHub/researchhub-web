import Loader from "~/components/Loader/Loader";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "~/redux/message";
import { NOTE_GROUPS } from "./config/notebookConstants";
import { captureError } from "~/config/utils/error";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import {
  createNewNote,
  createNoteContent,
  createNoteTemplate,
  deleteNote,
  fetchNote,
  makeNotePrivate,
  removePermissionsFromNote,
  updateNoteUserPermissions,
} from "~/config/fetch";
import { useAlert } from "react-alert";
import { useState } from "react";

const NoteOptionsMenuButton = ({
  currentOrg,
  customButtonStyles,
  note,
  redirectToNote,
  setMessage,
  show,
  showMessage,
  size = 20,
  title,
}) => {
  const alert = useAlert();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);

  const noteId = String(note.id);
  const menuItems = [
    {
      text: "Make private",
      icon: icons.lock,
      show: note.access !== NOTE_GROUPS.PRIVATE,
      hoverStyle: styles.blueHover,
      onClick: async (e) => {
        e && e.stopPropagation();
        setIsPopoverOpen(false);
        setMenuLoading(true);
        try {
          await makeNotePrivate({ noteId: noteId });
        } catch (error) {
          setMessage("Failed to make private");
          showMessage({ show: true, error: true });
          captureError({
            error,
            msg: "Failed to make private",
            data: { noteId, currentOrg },
          });
        }
        setMenuLoading(false);
      },
    },
    {
      text: "Move to Workspace",
      icon: icons.friends,
      show: note.access === NOTE_GROUPS.PRIVATE,
      hoverStyle: styles.blueHover,
      onClick: async (e) => {
        e && e.stopPropagation();
        setIsPopoverOpen(false);
        setMenuLoading(true);
        try {
          await updateNoteUserPermissions({
            orgId: currentOrg.id,
            noteId: noteId,
            accessType: "ADMIN",
          });
        } catch (error) {
          setMessage("Failed to update permission");
          showMessage({ show: true, error: true });
          captureError({
            error,
            msg: "Failed to update permission",
            data: { noteId, currentOrg },
          });
        }
        setMenuLoading(false);
      },
    },
    {
      text: "Duplicate",
      icon: icons.clone,
      show: true,
      hoverStyle: styles.blueHover,
      onClick: async (e) => {
        e && e.stopPropagation();
        setIsPopoverOpen(false);
        setMenuLoading(true);
        const response = await fetchNote({ noteId });
        const originalNote = await Helpers.parseJSON(response);

        let grouping =
          note.access === NOTE_GROUPS.SHARED
            ? NOTE_GROUPS.WORKSPACE
            : note.access;

        const params = {
          orgSlug: currentOrg.slug,
          title: title,
          grouping,
        };

        const duplicatedNote = await createNewNote(params);
        const noteContent = await createNoteContent({
          editorData: originalNote?.latest_version?.src ?? "",
          noteId: duplicatedNote.id,
        });

        setMenuLoading(false);
        duplicatedNote.access = grouping;
        redirectToNote(duplicatedNote);
      },
    },
    {
      text: "Save as template",
      icon: icons.shapes,
      show: true,
      hoverStyle: styles.blueHover,
      onClick: (e) => {
        e && e.stopPropagation();
        setIsPopoverOpen(false);
        setMenuLoading(true);
        fetchNote({ noteId })
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((data) => {
            if (data.latest_version?.src) {
              const params = {
                full_src: data.latest_version.src,
                is_default: false,
                name: title,
                organization: currentOrg?.id,
              };
              createNoteTemplate(params).then((data) => {
                setMessage("Template created");
                showMessage({ show: true, error: false });
              });
            } else {
              setMessage("Cannot create an empty template");
              showMessage({ show: true, error: true });
            }
            setMenuLoading(false);
          });
      },
    },
    {
      text: "Delete",
      icon: icons.trash,
      show: true,
      hoverStyle: styles.redHover,
      onClick: (e) => {
        e && e.stopPropagation();
        setIsPopoverOpen(false);
        alert.show({
          text: (
            <div>
              Permanently delete <b>{title}</b>? This cannot be undone.
            </div>
          ),
          buttonText: "Yes",
          onClick: async () => {
            setMenuLoading(true);
            try {
              const deletedNote = await deleteNote(noteId);
            } catch (error) {
              setMessage("Failed to delete note");
              showMessage({ show: true, error: true });
              captureError({
                error,
                msg: "Failed to delete note",
                data: { noteId, currentOrg },
              });
            }
            setMenuLoading(false);
          },
        });
      },
    },
  ].filter((item) => item.show);

  return (
    <div>
      <ResearchHubPopover
        align={"end"}
        isOpen={isPopoverOpen}
        padding={5}
        popoverContent={
          <div className={css(styles.popoverBodyContent)}>
            {menuItems.map((item, index) => (
              <div
                className={css(styles.popoverBodyItem, item.hoverStyle)}
                key={index}
                onClick={item.onClick}
              >
                <div className={css(styles.popoverBodyIcon)}>{item.icon}</div>
                <div className={css(styles.popoverBodyText)}>{item.text}</div>
              </div>
            ))}
          </div>
        }
        positions={["bottom", "top"]}
        onClickOutside={() => setIsPopoverOpen(false)}
        targetContent={
          <div
            style={{ fontSize: size }}
            className={css(
              customButtonStyles ?? styles.ellipsisButton,
              !show && !isPopoverOpen && styles.hide
            )}
            onClick={(e) => {
              e && e.preventDefault();
              setIsPopoverOpen(!isPopoverOpen);
            }}
          >
            {menuLoading ? <Loader size={18} /> : icons.ellipsisH}
          </div>
        }
      />
    </div>
  );
};

const styles = StyleSheet.create({
  ellipsisButton: {
    alignItems: "center",
    borderRadius: "50%",
    bottom: 0,
    color: colors.BLACK(0.7),
    cursor: "pointer",
    display: "flex",
    height: 27,
    justifyContent: "center",
    margin: "auto",
    position: "absolute",
    right: 7,
    top: 0,
    width: 27,
    ":hover": {
      backgroundColor: colors.GREY(0.7),
    },
  },
  hide: {
    display: "none",
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    width: 190,
  },
  popoverBodyItem: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    padding: 16,
    textDecoration: "none",
    wordBreak: "break-word",
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  blueHover: {
    ":hover": {
      color: "#fff",
      backgroundColor: "#3971ff",
    },
  },
  redHover: {
    ":hover": {
      color: "#fff",
      backgroundColor: colors.RED(0.8),
    },
  },
  popoverBodyIcon: {
    marginRight: 10,
  },
  popoverBodyText: {
    fontSize: 14,
  },
});

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteOptionsMenuButton);
