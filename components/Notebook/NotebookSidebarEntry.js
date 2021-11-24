import Link from "next/link";
import NoteOptionsMenuButton from "./NoteOptionsMenuButton";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { css, StyleSheet } from "aphrodite";
import { getNotePathname } from "~/components/Org/utils/orgHelper";
import { useState } from "react";

const NotebookSidebarEntry = ({
  currentNoteId,
  currentOrg,
  isOrgMember,
  note,
  redirectToNote,
  title,
}) => {
  const noteId = String(note.id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={getNotePathname({ noteId: note.id, org: currentOrg })}>
      <a
        className={css(styles.entry, noteId === currentNoteId && styles.active)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={css(styles.noteIcon)}>{icons.paper}</div>
        {title}
        {isOrgMember && (
          <NoteOptionsMenuButton
            currentOrg={currentOrg}
            key={note.id}
            note={note}
            redirectToNote={redirectToNote}
            show={isHovered}
            title={title}
          />
        )}
      </a>
    </Link>
  );
};

const styles = StyleSheet.create({
  entry: {
    backgroundClip: "padding-box",
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    padding: "10px 40px 10px 20px",
    position: "relative",
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  active: {
    backgroundColor: colors.GREY(0.3),
  },
  noteIcon: {
    color: colors.GREY(),
    marginRight: 10,
  },
});

export default NotebookSidebarEntry;
