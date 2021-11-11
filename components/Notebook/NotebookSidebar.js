import Link from "next/link";
import Loader from "~/components/Loader/Loader";
import NoteEntryPlaceholder from "~/components/Placeholders/NoteEntryPlaceholder";
import OrgAvatar from "~/components/Org/OrgAvatar";
import OrgEntryPlaceholder from "~/components/Placeholders/OrgEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import SidebarSectionContent from "~/components/Notebook/SidebarSectionContent";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { createNewNote } from "~/config/fetch";
import { css, StyleSheet } from "aphrodite";
import { isEmpty } from "~/config/utils/nullchecks";
import { useState, useEffect } from "react";

const NoteTemplateModal = dynamic(() =>
  import("~/components/Modals/NoteTemplateModal")
);
const ManageOrgModal = dynamic(() => import("~/components/Org/ManageOrgModal"));
const NewOrgModal = dynamic(() => import("~/components/Org/NewOrgModal"));

const NotebookSidebar = ({
  currentNoteId,
  currentOrg,
  didInitialNotesLoad,
  handleOrgSwitch,
  isPrivateNotebook,
  notes,
  onNoteDelete,
  onOrgChange,
  orgSlug,
  orgs,
  redirectToNote,
  titles,
}) => {
  const [createNoteLoading, setCreateNoteLoading] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);
  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [refetchTemplates, setRefetchTemplates] = useState(false);
  const [showManageOrgModal, setShowManageOrgModal] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [allowCreateNote, setAllowCreateNote] = useState(false);  

  useEffect(() => {
    if (currentOrg) {
      setAllowCreateNote(true);
    }
  }, [currentOrg]);

  const handleCreateNewNote = async () => {
    setCreateNoteLoading(true);

    let params;
    if (isPrivateNotebook) {
      params = {};
    } else {
      params = { orgSlug };
    }

    const note = await createNewNote(params);
    setCreateNoteLoading(false);
    redirectToNote(note);
  };

  return (
    <div className={css(styles.sidebar)}>
      <ManageOrgModal
        org={currentOrg}
        isOpen={showManageOrgModal}
        closeModal={() => setShowManageOrgModal(false)}
        onOrgChange={onOrgChange}
      />
      <NewOrgModal
        isOpen={showNewOrgModal}
        closeModal={() => setShowNewOrgModal(false)}
        onOrgChange={onOrgChange}
      />
      <NoteTemplateModal
        isOpen={isNoteTemplateModalOpen}
        orgSlug={orgSlug}
        redirectToNote={redirectToNote}
        refetchTemplates={refetchTemplates}
        setIsOpen={setIsNoteTemplateModalOpen}
      />
      <div className={css(styles.sidebarOrgContainer)}>
        <div>
          <ResearchHubPopover
            containerStyle={{ marginLeft: "10px", marginTop: "-10px" }}
            isOpen={isPopoverOpen}
            popoverContent={
              <div className={css(styles.popoverBodyContent)}>
                <div className={css(styles.userOrgs)}>
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
                            {!org.member_count
                              ? ""
                              : org.member_count === 1
                              ? "1 member"
                              : `${org.member_count} members`}
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
                <div
                  className={css(styles.newOrgContainer)}
                  onClick={() => {
                    setShowNewOrgModal(true);
                    setIsPopoverOpen(false);
                  }}
                >
                  <div
                    className={css(styles.actionButton, styles.newOrgButton)}
                  >
                    {icons.plus}
                  </div>{" "}
                  <span className={css(styles.newOrgText)}>
                    New Organization
                  </span>
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
                <>
                  <ReactPlaceholder
                    ready={!isEmpty(currentOrg)}
                    showLoadingAnimation
                    customPlaceholder={<OrgEntryPlaceholder color="#d3d3d3" />}
                  >
                    <div className={css(styles.avatarWrapper)}>
                      <OrgAvatar org={currentOrg} />
                    </div>
                    {currentOrg?.name}
                  </ReactPlaceholder>
                </>
                <span className={css(styles.sortIcon)}>{icons.sort}</span>
              </div>
            }
          />
        </div>
        <div
          className={css(
            styles.sidebarButtonsContainer,
            styles.orgButtonsContainer
          )}
        >
          {["MEMBER", "ADMIN"].includes(
            currentOrg?.user_permission?.access_type
          ) && (
            <div
              className={css(styles.sidebarButton, styles.orgButton)}
              onClick={() => {
                handleOrgSwitch({ orgId: currentOrg.id });
                setShowManageOrgModal(true);
              }}
            >
              {icons.cog}
              <span
                className={css(styles.sidebarButtonText, styles.orgButtonText)}
              >
                Settings & Members
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={css(styles.scrollable)}>
        <div
          className={css(
            styles.sidebarSection,
            hideNotes && styles.showBottomBorder
          )}
        >
          Notes
          {allowCreateNote &&
            <span className={css(styles.chevronIcon)}>
              {createNoteLoading ? (
                <Loader type="clip" size={23} />
              ) : (
                <div
                  className={css(styles.actionButton)}
                  onClick={handleCreateNewNote}
                >
                  {icons.plus}
                </div>
              )}
            </span>
          }
        </div>
        <ReactPlaceholder
          ready={didInitialNotesLoad}
          showLoadingAnimation
          customPlaceholder={<NoteEntryPlaceholder color="#d3d3d3" />}
        >
          {!hideNotes && (
            <div>
              {notes.map((note) => {
                const noteId = note.id.toString();
                return (
                  <SidebarSectionContent
                    currentNoteId={currentNoteId}
                    currentOrg={currentOrg}
                    isPrivateNotebook={isPrivateNotebook}
                    key={noteId}
                    noteId={noteId}
                    notes={notes}
                    onNoteDelete={onNoteDelete}
                    redirectToNote={redirectToNote}
                    refetchTemplates={refetchTemplates}
                    setRefetchTemplates={setRefetchTemplates}
                    title={titles[noteId]}
                  />
                );
              })}
            </div>
          )}
        </ReactPlaceholder>

        <div className={css(styles.sidebarButtonsContainer)}>
          <div
            className={css(styles.sidebarButton)}
            onClick={() => setIsNoteTemplateModalOpen(true)}
          >
            {icons.shapes}
            <span className={css(styles.sidebarButtonText)}>Templates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  sidebarOrgContainer: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  avatarWrapper: {
    marginRight: 10,
  },
  userOrgs: {
    maxHeight: 300,
    overflowY: "auto",
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
    cursor: "pointer",
    boxSizing: "border-box",
  },
  newOrgText: {
    marginLeft: 10,
    paddingTop: 7,
  },
  orgButton: {
    paddingLeft: 17,
  },
  orgButtonText: {},
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
  scrollable: {
    overflow: "auto",
  },
  sidebarSection: {
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
    padding: 20,
    userSelect: "none",
    alignItems: "center",
  },
  sidebarSectionContent: {
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
  sidebarNewNote: {
    // borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLUE(),
    cursor: "pointer",
    display: "flex",
    marginTop: "auto",
    // padding: 20,
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
  showBottomBorder: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  sidebarButtonsContainer: {
    margin: 10,
  },
  orgButtonsContainer: {
    margin: 0,
    marginLeft: 10,
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
    marginLeft: "auto",
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
