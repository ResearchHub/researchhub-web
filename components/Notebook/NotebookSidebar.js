import Link from "next/link";
import NoteEntryPlaceholder from "~/components/Placeholders/NoteEntryPlaceholder";
import NotebookSidebarGroup from "~/components/Notebook/NotebookSidebarGroup";
import OrgAvatar from "~/components/Org/OrgAvatar";
import OrgEntryPlaceholder from "~/components/Placeholders/OrgEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import groupBy from "lodash/groupBy";
import icons, { DownIcon } from "~/config/themes/icons";
import { NOTE_GROUPS, PERMS, ENTITIES } from "./config/notebookConstants";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { isEmpty } from "~/config/utils/nullchecks";
import { useState, useMemo } from "react";

const ManageOrgModal = dynamic(() => import("~/components/Org/ManageOrgModal"));
const NewOrgModal = dynamic(() => import("~/components/Org/NewOrgModal"));
const NoteTemplateModal = dynamic(() =>
  import("~/components/Modals/NoteTemplateModal")
);

const NotebookSidebar = ({
  currentNoteId,
  currentOrg,
  didInitialNotesLoad,
  fetchAndSetOrg,
  isOrgMember,
  notes,
  onOrgChange,
  orgSlug,
  orgs,
  redirectToNote,
  refetchTemplates,
  templates,
  titles,
}) => {
  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showManageOrgModal, setShowManageOrgModal] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const groupedNotes = useMemo(() => groupBy(notes, "access"), [notes]);

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
        templates={templates}
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
                  className={css(
                    styles.popoverBodyItem,
                    styles.newOrgContainer
                  )}
                  onClick={() => {
                    setShowNewOrgModal(true);
                    setIsPopoverOpen(false);
                  }}
                >
                  <div className={css(styles.newOrgButton)}>{icons.plus}</div>
                  New Organization
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
                <DownIcon withAnimation={false} />
              </div>
            }
          />
        </div>
        {isOrgMember && (
          <div className={css(styles.sidebarButtonsContainer)}>
            <div
              className={css(styles.sidebarButton)}
              onClick={() => {
                fetchAndSetOrg({ orgId: currentOrg.id });
                setShowManageOrgModal(true);
              }}
            >
              {icons.cog}
              <span className={css(styles.sidebarButtonText)}>
                Settings & Members
              </span>
            </div>
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
          {getSidebarGroupKeys().map((groupKey) => (
            <NotebookSidebarGroup
              availGroups={Object.keys(groupedNotes)}
              currentNoteId={currentNoteId}
              currentOrg={currentOrg}
              groupKey={groupKey}
              isOrgMember={isOrgMember}
              key={groupKey}
              notes={groupedNotes[groupKey] || []}
              orgs={orgs}
              redirectToNote={redirectToNote}
              titles={titles}
            />
          ))}
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
    color: colors.PURPLE(),
    fontWeight: 500,
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  newOrgButton: {
    alignItems: "center",
    background: colors.LIGHT_GREY(),
    border: "1px solid #ddd",
    borderRadius: "50%",
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: 30,
    justifyContent: "center",
    marginRight: 10,
    transition: "all ease-in-out 0.1s",
    width: 30,
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
    fontWeight: 700,
    letterSpacing: 1.1,
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
    padding: 15,
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.2),
    },
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
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
  sidebarButtonsContainer: {
    margin: "0px 10px 10px 10px",
  },
  sidebarButton: {
    border: "none",
    color: colors.BLACK(0.6),
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
});

export default NotebookSidebar;
