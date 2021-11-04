import ManageNotePermissions from "./ManageNotePermissions";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import { useState } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const NoteShareButton = ({
  noteId,
  notePerms,
  currentOrg,
  userOrgs,
  refetchNotePerms,
  onNotePermChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverContent={
        <div className={css(styles.popoverContainer)}>
          <ManageNotePermissions
            notePerms={notePerms}
            currentOrg={currentOrg}
            userOrgs={userOrgs}
            noteId={noteId}
            refetchNotePerms={refetchNotePerms}
            onNotePermChange={onNotePermChange}
          />
        </div>
      }
      positions={["bottom", "top"]}
      onClickOutside={(e) => {
        const childPopoverFound = e.path.find((el) =>
          (el.className || "").includes("perm-popover")
        );

        if (!childPopoverFound) {
          setIsOpen(false);
        }
      }}
      targetContent={
        <div className={css(styles.buttonContainer)}>
          <span
            className={css(styles.shareLink)}
            onClick={() => setIsOpen(!isOpen)}
          >
            Share
          </span>
        </div>
      }
    />
  );
};

const styles = StyleSheet.create({
  popoverContainer: {
    background: "white",
    width: "auto",
    minHeight: 50,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    marginRight: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  shareLink: {
    fontSize: 16,
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

export default NoteShareButton;
