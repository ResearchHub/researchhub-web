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
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverStyle={{ transform: "translate(-20px, 20px)" }}
      popoverContent={
        <div className={css(styles.popoverContainer)}>
          <ManageNotePermissions
            notePerms={notePerms}
            currentOrg={currentOrg}
            userOrgs={userOrgs}
            noteId={noteId}
            refetchNotePerms={refetchNotePerms}
          />
        </div>
      }
      positions={["bottom", "top"]}
      onClickOutside={(e) => {
        setIsOpen(false);

        // const childPopoverFound = e.path.find((el) => {
        //   if (typeof el?.getAttribute === "function") {
        //     if ((el.getAttribute("class") || "").includes("perm-popover")) {
        //       return true;
        //     }
        //   }
        // });

        // if (!childPopoverFound) {
        //   setIsOpen(false);
        // }
      }}
      targetContent={
        <span
          className={css(styles.shareLink)}
          onClick={(e) => {
            e && e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          Share
        </span>
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
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
  shareLink: {
    cursor: "pointer",
    fontSize: 16,
    margin: "0px 20px",
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

export default NoteShareButton;
