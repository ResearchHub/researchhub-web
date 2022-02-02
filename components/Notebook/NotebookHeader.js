import Button from "~/components/Form/Button";
import Link from "next/link";
import NoteOptionsMenuButton from "~/components/Notebook/NoteOptionsMenuButton";
import NoteShareButton from "~/components/Notebook/NoteShareButton";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useState } from "react";

const NotePublishModal = dynamic(() =>
  import("~/components/Modals/NotePublishModal")
);

const NotebookHeader = ({
  currentNote,
  currentOrganization,
  getEditorContent,
  isOrgMember,
  notePerms,
  onRefChange,
  redirectToNote,
  refetchNotePerms,
  userOrgs,
}) => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <div className={css(styles.noteHeader)}>
      <NotePublishModal
        currentNote={currentNote}
        currentOrganization={currentOrganization}
        getEditorContent={getEditorContent}
        isOpen={isPublishModalOpen}
        setIsOpen={setIsPublishModalOpen}
      />
      <div className={css(styles.noteHeaderOpts)}>
        <div className="presence" ref={onRefChange} />
        <NoteShareButton
          noteId={currentNote.id}
          notePerms={notePerms}
          org={currentOrganization}
          refetchNotePerms={refetchNotePerms}
          userOrgs={userOrgs}
        />
        {!isNullOrUndefined(currentNote.post) && (
          <Link href={`/post/${currentNote.post.id}/${currentNote.post.slug}`}>
            <a className={css(styles.publishedLink)}>View post</a>
          </Link>
        )}
        <Button
          customButtonStyle={styles.publishButton}
          hideRipples={true}
          label={currentNote.post ? "Republish" : "Publish"}
          onClick={() => setIsPublishModalOpen(true)}
        />
        {isOrgMember && (
          <NoteOptionsMenuButton
            currentOrg={currentOrganization}
            customButtonStyles={styles.ellipsisButton}
            note={currentNote}
            redirectToNote={redirectToNote}
            show={true}
            size={24}
            title={currentNote.title}
          />
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  noteHeader: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "column",
    margin: "auto 30px 0px auto",
    paddingTop: 10,
    userSelect: "none",
  },
  noteHeaderOpts: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  publishButton: {
    height: 40,
    marginRight: 20,
    padding: 20,
    width: 100,
  },
  ellipsisButton: {
    alignItems: "center",
    borderRadius: "50%",
    bottom: 0,
    color: colors.BLACK(0.7),
    cursor: "pointer",
    display: "flex",
    height: 30,
    justifyContent: "center",
    margin: "auto",
    right: 7,
    top: 0,
    width: 30,
    ":hover": {
      backgroundColor: colors.GREY(0.5),
    },
  },
  publishedLink: {
    color: "unset",
    cursor: "pointer",
    marginRight: 20,
    textDecoration: "none",
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

export default NotebookHeader;
