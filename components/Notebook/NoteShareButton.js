import ManageNotePermissions from "./ManageNotePermissions";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import { useState } from "react";
import { css, StyleSheet } from "aphrodite";
import Button from "~/components/Form/Button";

const NoteShareButton = ({ noteId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ResearchHubPopover
      containerStyle={{ "z-index": 100 }}
      isOpen={isOpen}
      popoverContent={
        <div className={css(styles.popoverContainer)}>
          <ManageNotePermissions noteId={noteId} />
        </div>   
      }
      positions={["bottom", "top"]}
      setIsPopoverOpen={() => setIsOpen(false)}
      targetContent={
        <div
          className={css(styles.buttonContainer)}
        >
          <Button
            onClick={() => setIsOpen(true)}
            size={"xsmall"}
            label={`Share`}
            isWhite={true}>Share
          </Button>
        </div>
      }
      withArrow
    />
  )
}

const styles = StyleSheet.create({
  popoverContainer: {
    background: "white",
    width: 400,
    minHeight: 50,
    border: "1px solid"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: 20,    
  }
});

export default NoteShareButton;
