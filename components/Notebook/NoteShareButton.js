import ManageNotePermissions from "./ManageNotePermissions";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import { useState } from "react";
import { css, StyleSheet } from "aphrodite";
import Button from "~/components/Form/Button";

const NoteShareButton = ({ noteId, org = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverContent={
        <div className={css(styles.popoverContainer)}>
          <ManageNotePermissions org={org} noteId={noteId} />
        </div>
      }
      positions={["bottom", "top"]}
      setIsPopoverOpen={() => setIsOpen(false)}
      targetContent={
        <div className={css(styles.buttonContainer)}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size={"xsmall"}
            label={`Share`}
            hideRipples={true}
            isWhite={true}
          >
            Share
          </Button>
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
    marginTop: 10,
    marginRight: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: 20,
  },
});

export default NoteShareButton;
