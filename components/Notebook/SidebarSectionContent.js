import Link from "next/link";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { deleteNote, createNewNote, createNoteContent } from "~/config/fetch";
import { fetchNote, createNoteTemplate } from "~/config/fetch";
import { getNotePathname } from "~/config/utils/org";
import { useAlert } from "react-alert";
import { useState } from "react";

const SidebarSectionContent = ({
  currentNoteId,
  currentOrg,
  isPrivateNotebook,
  noteId,
  onNoteCreate,
  onNoteDelete,
  refetchTemplates,
  setMessage,
  setRefetchTemplates,
  showMessage,
  title,
}) => {
  const alert = useAlert();
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const menuItems = [
    //{
    //  text: "Make private",
    //  icon: icons.lock,
    //  hoverStyle: styles.blueHover,
    //  onClick: () => setIsPopoverOpen(!isPopoverOpen),
    //},
    {
      text: "Duplicate",
      icon: icons.clone,
      hoverStyle: styles.blueHover,
      onClick: async () => {
        setIsPopoverOpen(false);
        let params;

        if (isPrivateNotebook) {
          params = { title };
        } else {
          params = { orgSlug: currentOrg.slug, title };
        }

        const note = await createNewNote(params);
        const noteContent = await createNoteContent({
          editorData: noteBody,
          noteId: note.id,
        });
        onNoteCreate(note);
      },
    },
    {
      text: "Save as template",
      icon: icons.shapes,
      hoverStyle: styles.blueHover,
      onClick: () => {
        setIsPopoverOpen(!isPopoverOpen);
        fetchNote({ noteId })
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((data) => {
            const params = {
              full_src: data.latest_version.src,
              is_default: false,
              name: title,
              organization: currentOrg?.id,
            };
            createNoteTemplate(params)
              .then((data) => {
                setMessage("Template created!");
                showMessage({ show: true, error: false });
                setRefetchTemplates(!refetchTemplates);
              });
          });
      },
    },
    {
      text: "Delete",
      icon: icons.trash,
      hoverStyle: styles.redHover,
      onClick: () => {
        setIsPopoverOpen(!isPopoverOpen);
        alert.show({
          text: `Permanently delete '${title}'? This cannot be undone.`,
          buttonText: "Yes",
          onClick: () => {
            deleteNote(noteId).then((deletedNote) => {
              onNoteDelete(deletedNote);
            });
          },
        });
      },
    },
  ];

  return (
    <Link href={getNotePathname({ noteId: noteId, org: currentOrg })}>
      <a
        className={css(
          styles.sidebarSectionContent,
          noteId === currentNoteId && styles.active
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={css(styles.noteIcon)}>{icons.paper}</div>
        {title}
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
            positions={["bottom"]}
            setIsPopoverOpen={setIsPopoverOpen}
            targetContent={
              <div
                className={css(
                  styles.ellipsisButton,
                  !isHovered && !isPopoverOpen && styles.hideEllipsis
                )}
                onClick={(e) => {
                  e && e.preventDefault();
                  setIsPopoverOpen(!isPopoverOpen);
                }}
              >
                {icons.ellipsisV}
              </div>
            }
          />
        </div>
      </a>
    </Link>
  );
};

const styles = StyleSheet.create({
  sidebarSectionContent: {
    backgroundClip: "padding-box",
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    padding: "20px 40px 20px 20px",
    position: "relative",
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
    ":last-child": {
      borderBottom: `1px solid ${colors.GREY(0.3)}`,
    },
  },
  active: {
    backgroundColor: colors.GREY(0.3),
  },
  noteIcon: {
    color: colors.GREY(),
    marginRight: 10,
  },
  ellipsisButton: {
    alignItems: "center",
    borderRadius: "50%",
    bottom: 0,
    color: colors.BLACK(0.7),
    display: "flex",
    fontSize: 20,
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
  hideEllipsis: {
    display: "none",
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    width: 175,
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
)(SidebarSectionContent);
