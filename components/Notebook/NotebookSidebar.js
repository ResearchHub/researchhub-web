import Link from "next/link";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import SidebarSectionContent from "~/components/Notebook/SidebarSectionContent";
import OrgAvatar from "~/components/Org/OrgAvatar";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { createNewNote } from "~/config/fetch";
import { css, StyleSheet } from "aphrodite";
import { getNotePathname } from "~/config/utils/org";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NoteTemplateModal = dynamic(() =>
  import("~/components/Modals/NoteTemplateModal")
);
const ManageOrgModal = dynamic(() => import("~/components/Org/ManageOrgModal"));
const NewOrgModal = dynamic(() => import("~/components/Org/NewOrgModal"));

const NotebookSidebar = ({
  currentOrg,
  editorInstances,
  isPrivateNotebook,
  needNoteFetch,
  notes,
  onNoteCreate,
  onOrgChange,
  orgs,
  refetchTemplates,
  setEditorInstances,
  setNeedNoteFetch,
  setNotes,
  setRefetchTemplates,
  titles,
  user,
}) => {
  const router = useRouter();

  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [showManageOrgModal, setShowManageOrgModal] = useState(false);
  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);

  const toggleSidebarSection = () => {
    setHideNotes(!hideNotes);
  };

  const handleCreateNewNote = async () => {
    let note;
    if (isPrivateNotebook) {
      note = await createNewNote({});
    } else {
      note = await createNewNote({ orgId: currentOrg.id });
    }

    return onNoteCreate(note);
  };

  const orgName = isPrivateNotebook ? "Personal Notes" : currentOrg.name;
  const orgImg = isPrivateNotebook
    ? user.author_profile.profile_image
    : currentOrg;

  return (
    <div className={css(styles.sidebar)}>
      {!isPrivateNotebook && (
        <ManageOrgModal
          org={currentOrg}
          isOpen={showManageOrgModal}
          closeModal={() => setShowManageOrgModal(false)}
          onOrgChange={onOrgChange}
        />
      )}
      <NewOrgModal
        isOpen={showNewOrgModal}
        closeModal={() => setShowNewOrgModal(false)}
      />
      <NoteTemplateModal
        currentOrganizationId={isPrivateNotebook ? 0 : currentOrg.id}
        currentOrg={currentOrg}
        isOpen={isNoteTemplateModalOpen}
        refetchNotes={needNoteFetch}
        refetchTemplates={refetchTemplates}
        setIsOpen={setIsNoteTemplateModalOpen}
        setRefetchNotes={setNeedNoteFetch}
        user={user}
      />
      <div>
        <ResearchHubPopover
          isOpen={isPopoverOpen}
          popoverContent={
            <div className={css(styles.popoverBodyContent)}>
              <Link href={{ pathname: `/me/notebook` }}>
                <a
                  className={css(styles.popoverBodyItem)}
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                >
                  <img
                    className={css(styles.popoverBodyItemImage)}
                    draggable="false"
                    src={user.author_profile.profile_image}
                  />
                  <div className={css(styles.popoverBodyItemTitle)}>
                    Personal Notes
                  </div>
                </a>
              </Link>
              {orgs.map((org) => (
                <Link
                  href={{
                    pathname: `/${org.slug}/notebook/`,
                  }}
                  key={org.id.toString()}
                >
                  <a
                    className={css(styles.popoverBodyItem)}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <div className={css(styles.avatarWrapper)}>
                      <OrgAvatar org={org} />
                    </div>
                    <div className={css(styles.popoverBodyItemText)}>
                      <div className={css(styles.popoverBodyItemTitle)}>
                        {org.name}
                      </div>
                      <div className={css(styles.popoverBodyItemSubtitle)}>
                        {"{count} members"}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
              <div
                className={css(styles.newOrgContainer)}
                onClick={() => {
                  setShowNewOrgModal(true);
                  setIsPopoverOpen(false);
                }}
              >
                <div className={css(styles.actionButton, styles.newOrgButton)}>
                  {icons.plus}
                </div>{" "}
                <span className={css(styles.newOrgText)}>New Organization</span>
              </div>
            </div>
          }
          positions={["bottom"]}
          setIsPopoverOpen={setIsPopoverOpen}
          targetContent={
            <div
              className={css(styles.popoverTarget)}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <div className={css(styles.avatarWrapper)}>
                <OrgAvatar org={currentOrg} />
              </div>
              {orgName}
              <span className={css(styles.sortIcon)}>{icons.sort}</span>
            </div>
          }
        />
      </div>
      {!isPrivateNotebook && (
        <div
          className={css(
            styles.sidebarButtonsContainer,
            styles.orgButtonsContainer
          )}
        >
          <div
            className={css(styles.sidebarButton, styles.orgButton)}
            onClick={() => setShowManageOrgModal(true)}
          >
            {icons.cog}
            <span
              className={css(styles.sidebarButtonText, styles.orgButtonText)}
            >
              Settings & Members
            </span>
          </div>
        </div>
      )}
      <div
        className={css(
          styles.sidebarSection,
          hideNotes && styles.showBottomBorder
        )}
        onClick={toggleSidebarSection}
      >
        Notes
        <span className={css(styles.chevronIcon)}>
          {hideNotes ? icons.chevronDown : icons.chevronUp}
        </span>
      </div>
      {!hideNotes && (
        <div>
          {notes.map((note) => {
            const noteId = note.id.toString();
            const editorInstance = editorInstances.find(
              (editor) =>
                noteId === editor.config._config.collaboration.channelId
            );
            return (
              <SidebarSectionContent
                currentNoteId={router.query.noteId}
                currentOrg={currentOrg}
                editorInstances={editorInstances}
                key={noteId}
                noteBody={editorInstance?.getData() ?? ""}
                noteId={noteId}
                notes={notes}
                pathname={getNotePathname({ noteId, org: currentOrg })}
                refetchTemplates={refetchTemplates}
                setEditorInstances={setEditorInstances}
                setNotes={setNotes}
                setRefetchTemplates={setRefetchTemplates}
                title={titles[noteId]}
              />
            );
          })}
        </div>
      )}
      <div className={css(styles.sidebarButtonsContainer)}>
        <div
          className={css(styles.sidebarButton)}
          onClick={() => setIsNoteTemplateModalOpen(true)}
        >
          {icons.shapes}
          <span className={css(styles.sidebarButtonText)}>Templates</span>
        </div>
        <div className={css(styles.sidebarButton)}>
          {icons.fileImport}
          <span className={css(styles.sidebarButtonText)}>Import</span>
        </div>
      </div>
      <div className={css(styles.sidebarNewNote)} onClick={handleCreateNewNote}>
        <div className={css(styles.actionButton)}>{icons.plus}</div>
        <div className={css(styles.newNoteText)}>Create New Note</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  orgButtonsContainer: {
    marginTop: 0,
  },
  orgButton: {
    paddingLeft: 17,
  },
  avatarWrapper: {
    marginRight: 10,
  },
  orgButtonText: {
    marginLeft: 20,
  },
  container: {
    display: "flex",
  },
  sidebar: {
    background: "#f9f9fc",
    borderRight: `1px solid ${colors.GREY(0.3)}`,
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 80px)",
    left: 0,
    maxWidth: 300,
    minWidth: 240,
    position: "fixed",
    top: 80,
    width: "16%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  popoverTarget: {
    alignItems: "center",
    color: colors.BLACK(0.6),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 1.2,
    padding: 20,
    textTransform: "uppercase",
    userSelect: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    marginTop: -10,
    userSelect: "none",
    width: 270,
  },
  popoverBodyItem: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    padding: 16,
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.2),
    },
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  popoverBodyItemImage: {
    borderRadius: "50%",
    height: 30,
    marginRight: 10,
    objectFit: "cover",
    width: 30,
  },
  popoverBodyItemText: {
    display: "flex",
    flexDirection: "column",
  },
  popoverBodyItemTitle: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  popoverBodyItemSubtitle: {
    color: colors.BLACK(0.5),
    fontSize: 13,
    marginTop: 2,
  },
  sidebarSection: {
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
    padding: 20,
    userSelect: "none",
  },
  sidebarSectionContent: {
    backgroundClip: "padding-box",
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    padding: 20,
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
  newOrgContainer: {
    cursor: "pointer",
    display: "flex",
    padding: 16,
    color: colors.BLUE(),
    fontWeight: 500,
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  newOrgButton: {
    width: 30,
    height: 30,
    marginLeft: 0,
  },
  newOrgText: {
    marginLeft: 5,
    paddingTop: 7,
  },
  sidebarNewNote: {
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLUE(),
    cursor: "pointer",
    display: "flex",
    marginTop: "auto",
    padding: 20,
    ":hover": {
      color: "#3E43E8",
    },
  },
  newNoteText: {
    fontSize: 18,
    fontWeight: 500,
    margin: "auto",
  },
  actionButton: {
    alignItems: "center",
    background: colors.LIGHT_GREY(),
    border: "1px solid #ddd",
    borderRadius: "50%",
    display: "flex",
    fontSize: 16,
    height: 35,
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
    transition: "all ease-in-out 0.1s",
    width: 35,
    "@media only screen and (max-width: 415px)": {
      height: 33,
      width: 33,
    },
    "@media only screen and (max-width: 321px)": {
      height: 31,
      width: 31,
    },
  },
  showBottomBorder: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  sidebarButtonsContainer: {
    margin: 10,
  },
  sidebarButton: {
    border: "none",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    maxWidth: "fit-content",
    padding: 10,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  sidebarButtonText: {
    marginLeft: 10,
  },
  sortIcon: {
    marginLeft: 10,
  },
  chevronIcon: {
    marginLeft: "auto",
  },
  noteIcon: {
    color: colors.GREY(),
    marginRight: 10,
  },
});

export default NotebookSidebar;
