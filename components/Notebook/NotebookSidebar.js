import AuthorAvatar from "~/components/AuthorAvatar";
import Link from "next/link";
import NoteEntryPlaceholder from "~/components/Placeholders/NoteEntryPlaceholder";
import OrgAvatar from "~/components/Org/OrgAvatar";
import ReactPlaceholder from "react-placeholder/lib";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { useState, useMemo } from "react";
import OrgEntryPlaceholder from "~/components/Placeholders/OrgEntryPlaceholder";
import NotebookSidebarGroup from "~/components/Notebook/NotebookSidebarGroup";
import { isEmpty } from "~/config/utils/nullchecks";
import groupBy from "lodash/groupBy";
import { NOTE_GROUPS, PERMS, ENTITIES } from "./config/notebookConstants";
import { isOrgMember } from "~/components/Org/utils/orgHelper";

const NoteTemplateModal = dynamic(() =>
  import("~/components/Modals/NoteTemplateModal")
);
const ManageOrgModal = dynamic(() => import("~/components/Org/ManageOrgModal"));
const NewOrgModal = dynamic(() => import("~/components/Org/NewOrgModal"));

const NotebookSidebar = ({
  currentNoteId,
  currentOrg,
  didInitialNotesLoad,
  fetchAndSetOrg,
  notes,
  onNoteCreate,
  onNoteDelete,
  onOrgChange,
  onNotePermChange,
  orgSlug,
  orgs,
  setTitles,
  titles,
  user,
  templates,
  refetchTemplates,
}) => {
  const [hideNotes, setHideNotes] = useState(false);
  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showManageOrgModal, setShowManageOrgModal] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const groupedNotes = useMemo(() => groupBy(notes, "access"), [notes]);
  const _isOrgMember = isOrgMember({ user, org: currentOrg });

  const getSidebarGroupKeys = () => {
    let groups = Object.keys(groupedNotes);

    const orgAccess = PERMS.getValByEnum({
      permEnum: currentOrg?.user_permission?.access_type,
      forEntity: ENTITIES.ORG,
    });

    if (orgAccess >= PERMS.ORG.MEMBER) {
      groups.push(NOTE_GROUPS.WORKSPACE);
    }

    if (currentOrg?.member_count > 1 && orgAccess >= PERMS.ORG.MEMBER) {
      groups.push(NOTE_GROUPS.PRIVATE);
    }

    return sortSidebarGroups(groups);
  };

  const sortSidebarGroups = (sidebarGroups) => {
    const sorted = [];
    if (sidebarGroups.includes(NOTE_GROUPS.WORKSPACE)) {
      sorted.push(NOTE_GROUPS.WORKSPACE);
    }
    if (sidebarGroups.includes(NOTE_GROUPS.PRIVATE)) {
      sorted.push(NOTE_GROUPS.PRIVATE);
    }
    if (sidebarGroups.includes(NOTE_GROUPS.SHARED)) {
      sorted.push(NOTE_GROUPS.SHARED);
    }

    return sorted;
  };

  const buildHtmlForGroup = ({ groupKey }) => {
    return (
      <NotebookSidebarGroup
        key={groupKey}
        groupKey={groupKey}
        availGroups={Object.keys(groupedNotes)}
        currentOrg={currentOrg}
        orgs={orgs}
        user={user}
        notes={groupedNotes[groupKey] || []}
        titles={titles}
        currentNoteId={currentNoteId}
        onNoteCreate={onNoteCreate}
        onNoteDelete={onNoteDelete}
        onNotePermChange={onNotePermChange}
      />
    );
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
        currentOrg={currentOrg}
        onNoteCreate={onNoteCreate}
        currentOrganizationId={currentOrg?.id}
        isOpen={isNoteTemplateModalOpen}
        orgSlug={orgSlug}
        setIsOpen={setIsNoteTemplateModalOpen}
        user={user}
        setTitles={setTitles}
        titles={titles}
        notes={notes}
        templates={templates}
        refetchTemplates={refetchTemplates}
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
            onClickOutside={() => setIsPopoverOpen(false)}
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
        <div className={css(styles.sidebarButtonsContainer)}>
          {_isOrgMember && (
            <div
              className={css(styles.sidebarButton)}
              onClick={() => {
                fetchAndSetOrg({ orgId: currentOrg.id });
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
        {_isOrgMember && (
          <div className={css(styles.sidebarButtonsContainer)}>
            <div
              className={css(styles.sidebarButton)}
              onClick={() => setIsNoteTemplateModalOpen(true)}
            >
              {icons.shapes}
              <span className={css(styles.sidebarButtonText)}>Templates</span>
            </div>
          </div>
        )}
      </div>
      <div className={css(styles.scrollable)}>
        <ReactPlaceholder
          ready={didInitialNotesLoad && !isEmpty(currentOrg)}
          showLoadingAnimation
          customPlaceholder={<NoteEntryPlaceholder color="#d3d3d3" />}
        >
          {getSidebarGroupKeys().map((groupKey) =>
            buildHtmlForGroup({ groupKey })
          )}
        </ReactPlaceholder>
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
    padding: 15,
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
    padding: "15px 20px",
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
    padding: 15,
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
    paddingLeft: 17,
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
