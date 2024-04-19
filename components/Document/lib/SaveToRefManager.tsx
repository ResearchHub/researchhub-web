import { faAngleDown, faFolderPlus } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import ProjectExplorer from "~/components/ReferenceManager/lib/ProjectExplorer";
import { StyleSheet, css } from "aphrodite";
import { fetchReferenceOrgProjects } from "~/components/ReferenceManager/references/reference_organizer/api/fetchReferenceOrgProjects";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import colors from "~/config/themes/colors";
import { ID } from "~/config/types/root_types";
import API, { generateApiUrl } from "~/config/api";
import Helpers from "~/config/api/helpers";
import OrgAvatar from "~/components/Org/OrgAvatar";
import { useReferenceProjectUpsertContext } from "~/components/ReferenceManager/references/reference_organizer/context/ReferenceProjectsUpsertContext";
import ReferenceProjectsUpsertModal from "~/components/ReferenceManager/references/reference_organizer/ReferenceProjectsUpsertModal";
import { emptyFncWithMsg, silentEmptyFnc } from "~/config/utils/nullchecks";
import { removeReferenceCitations } from "~/components/ReferenceManager/references/api/removeReferenceCitations";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import showSaveToRefManagerToast from "~/components/Notifications/lib/showSaveToRefManagerToast";
import {
  SavedCitation,
  parseSavedCitation,
  savedCitationsContext,
} from "~/components/contexts/SavedCitationsContext";
import { genClientId } from "~/config/utils/id";

interface Props {
  unifiedDocumentId: ID;
  contentType: "paper" | "post";
  contentId: ID;
  unsavedBtnComponent: JSX.Element;
  savedBtnComponent: JSX.Element;
}

interface SaveToRefManagerApiProps {
  orgId: ID;
  projectId: ID;
  contentId: ID;
  contentType: "paper" | "post";
}

const saveToRefManagerApi = async ({
  orgId,
  projectId,
  contentId,
  contentType,
}: SaveToRefManagerApiProps): Promise<SavedCitation> => {
  const url = generateApiUrl(
    contentType === "paper"
      ? `citation_entry/${contentId}/add_paper_as_citation`
      : `citation_entry/${contentId}/add_post_as_citation`
  );

  return fetch(
    url,
    API.POST_CONFIG(
      { project_id: projectId },
      undefined,
      orgId ? { "x-organization-id": orgId } : undefined
    )
  )
    .then((res): any => Helpers.parseJSON(res))
    .then((data) => {
      return parseSavedCitation(data);
    });
};

const isDocSavedToAnyUserOrg = ({
  savedCitations,
  unifiedDocumentId,
}: {
  savedCitations: SavedCitation[];
  unifiedDocumentId: ID;
}) => {
  return savedCitations.some(
    (citation) => citation.relatedUnifiedDocumentId === unifiedDocumentId
  );
};

const SaveToRefManager = ({
  unifiedDocumentId,
  contentId,
  contentType,
  unsavedBtnComponent,
  savedBtnComponent,
}: Props) => {
  const { savedCitations, setSavedCitations } = savedCitationsContext();
  const [orgProjects, setOrgProjects] = useState([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [refId, setRefId] = useState(`ref-${genClientId()}`);
  const projectCitationMap = useRef<{
    [key: string]: Array<string>;
  }>({});

  const { orgs, setCurrentOrg } = useOrgs();
  const btnRef = useRef(null);

  const {
    setIsModalOpen: setIsProjectUpsertModalOpen,
    setProjectValue: setProjectUpsertValue,
    setUpsertPurpose: setProjectUpsertPurpose,
  } = useReferenceProjectUpsertContext();

  useEffect(() => {
    if (selectedOrg && isOpen) {
      setIsFetchingProjects(true);
      projectCitationMap.current = {};

      fetchReferenceOrgProjects({
        onError: () => {
          console.error("Failed to fetch projects");
          setIsFetchingProjects(false);
        },
        onSuccess: (payload): void => {
          setOrgProjects(payload ?? []);
          setIsFetchingProjects(false);
        },
        payload: {
          organization: selectedOrg.id,
        },
      });
    }
  }, [selectedOrg, isOpen]);

  useEffect(() => {
    if (orgs && orgs.length > 0 && !selectedOrg) {
      // If this document appears in a saved org already, default to that org.
      const orgIdWhichCitationIsSavedTo = savedCitations.find(
        (citation) => citation.relatedUnifiedDocumentId === unifiedDocumentId
      )?.organizationId;
      const selectedOrg =
        orgs.find((org) => org.id === orgIdWhichCitationIsSavedTo) || orgs[0];

      setSelectedOrg(selectedOrg);
    }
  }, [orgs]);

  useEffectHandleClick({
    ref: btnRef,
    exclude: ["." + refId],
    onOutsideClick: () => {
      setIsOpen(false);
    },
  });

  const savedInProjectIds = savedCitations
    .filter(
      (citation) => citation.relatedUnifiedDocumentId === unifiedDocumentId
    )
    .map((citation) => citation.projectId);
  const isSaved = isDocSavedToAnyUserOrg({
    savedCitations,
    unifiedDocumentId,
  });

  const removeCitationsFromProjectApi = (citationIds: ID[]) => {
    setSavedCitations(
      savedCitations.filter((citation) => !citationIds.includes(citation.id))
    ); // Optimistic save

    removeReferenceCitations({
      onError: () => {
        setSavedCitations([...savedCitations]); // Revert on error
      },
      orgId: selectedOrg!.id,
      onSuccess: emptyFncWithMsg,
      payload: {
        citation_entry_ids: citationIds,
      },
    });
  };

  const addCitationsToProjectApi = (projectId: ID) => {
    const tempId = genClientId(); // Temporary id to show optimistic save
    setSavedCitations([
      ...savedCitations,
      {
        id: tempId,
        organizationId: selectedOrg?.id,
        projectId,
        relatedUnifiedDocumentId: unifiedDocumentId,
      },
    ]);

    saveToRefManagerApi({
      contentId,
      contentType,
      projectId,
      orgId: selectedOrg?.id,
    })
      .then((citation: SavedCitation) => {
        setSavedCitations([
          ...savedCitations.filter((citation) => citation.id !== tempId),
          citation,
        ]);
      })
      .catch((error) => {
        setSavedCitations([...savedCitations]);
        console.error("Failed to save citation", error);
      });
  };

  const handleSelectProject = (project) => {
    if (savedInProjectIds.includes(project.id)) {
      // @ts-ignore
      const citationIdsToRemove = savedCitations
        .filter(
          (citation) =>
            citation.projectId === project.id &&
            citation.relatedUnifiedDocumentId === unifiedDocumentId
        )
        .map((citation) => citation.id);

      showSaveToRefManagerToast({
        action: "REMOVE",
        project,
        org: selectedOrg,
        onActionClick: () => {
          // Undo
          addCitationsToProjectApi(project.id);
          showSaveToRefManagerToast({
            action: "ADD",
            project,
            org: selectedOrg,
          });
        },
        actionLabel: "Undo",
      }); // Optimistic notification before API is called

      removeCitationsFromProjectApi(citationIdsToRemove);
    } else {
      showSaveToRefManagerToast({ action: "ADD", project, org: selectedOrg }); // Optimistic notification before API is called
      addCitationsToProjectApi(project.id);
    }
  };

  return (
    <div>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ReferenceProjectsUpsertModal
          org={selectedOrg}
          redirectAfterUpsert={false}
          onUpsertSuccess={(project) => {
            fetchReferenceOrgProjects({
              onError: () => {
                silentEmptyFnc();
              },
              onSuccess: (payload): void => {
                setOrgProjects(payload ?? []);
              },
              payload: {
                organization: selectedOrg.id,
              },
            });
          }}
        />
      </div>

      <div className={css(styles.wrapper) + " " + refId}>
        <div>
          <PermissionNotificationWrapper
            modalMessage="edit document"
            permissionKey="UpdatePaper"
            loginRequired={true}
            onClick={() => setIsOpen(!isOpen)}
            hideRipples={true}
          >
            <div ref={btnRef}>
              {isSaved ? savedBtnComponent : unsavedBtnComponent}
            </div>
          </PermissionNotificationWrapper>
        </div>
        {isOpen && (
          <div className={css(styles.main) + " save-ref-open"}>
            <div className={css(styles.title)}>Save to Reference Manager</div>
            <div
              className={css(styles.dropdown)}
              onClick={() => {
                setIsOrgSelectorOpen(!isOrgSelectorOpen);
              }}
            >
              <div className={css(styles.dropdownValue)}>
                {selectedOrg && (
                  <>
                    <OrgAvatar size={24} fontSize={12} org={selectedOrg} />
                    {selectedOrg?.name}
                  </>
                )}
              </div>
              <div className={css(styles.dropdownDownIcon)}>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  color={colors.MEDIUM_GREY2()}
                />
              </div>

              {isOrgSelectorOpen && (
                <div className={css(styles.dropdownContent)}>
                  <div className={css(styles.explorer)}>
                    {orgs.map((org) => {
                      return (
                        <div
                          className={css(styles.orgSelect)}
                          onClick={() => {
                            setSelectedOrg(org);
                            // @ts-ignore
                            setCurrentOrg(org);
                            setIsOrgSelectorOpen(false);
                          }}
                        >
                          <OrgAvatar size={24} fontSize={12} org={org} />
                          <span style={{ marginLeft: 5 }}>{org.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className={css(styles.projects)}>
              <div className={css(styles.explorer)}>
                <div
                  style={{
                    color: colors.MEDIUM_GREY2(),
                    fontSize: 14,
                    fontWeight: 500,
                    padding: "10px 16px 10px 2px",
                  }}
                >
                  Folders
                </div>
                <div className={css(styles.divider)}></div>
                <div
                  className={css(styles.newFolder)}
                  onClick={(event): void => {
                    event.preventDefault();
                    setProjectUpsertPurpose("create");
                    setIsProjectUpsertModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFolderPlus}
                    style={{
                      marginRight: 10,
                      fontSize: 22,
                      fontWeight: 500,
                      color: colors.NEW_BLUE(),
                    }}
                  />
                  Create a new folder
                </div>
                <div className={css(styles.explorerWrapper)}>
                  <ProjectExplorer
                    handleClick={() => null}
                    currentOrg={selectedOrg}
                    currentOrgProjects={orgProjects}
                    allowSelection={true}
                    selectedProjectIds={savedInProjectIds}
                    handleSelectProject={handleSelectProject}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  savedTriggerBtn: {
    borderColor: colors.NEW_GREEN(),
  },
  projects: {},
  explorerWrapper: {},
  saveButton: {
    height: 30,
    width: 50,
  },
  removeButtonLabel: {
    fontSize: 14,
    fontWeight: 400,
    ":hover": {
      color: colors.MEDIUM_GREY2(),
    },
  },
  viewButtonLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  removeButton: {
    height: 30,
    color: colors.MEDIUM_GREY2(),
    hover: {
      color: colors.MEDIUM_GREY2(),
    },
  },
  viewButton: {
    display: "flex",
    alignItems: "center",
    height: 30,
  },
  dropdownValue: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
  dropdown: {
    border: `1px solid #DEDEE6`,
    background: "#FAFAFC",
    borderRadius: 4,
    padding: "5px 10px",
    fontSize: 14,
    height: 42,
    display: "flex",
    width: "100%",
    position: "relative",
    userSelect: "none",
    cursor: "pointer",
    marginBottom: 10,
    ":hover": {
      background: "#F0F0F7",
    },
    boxSizing: "border-box",
  },
  title: {
    marginBottom: 15,
    fontWeight: 500,
    fontSize: 14,
  },
  divider: {
    borderBottom: "1px solid #DEDEE6",
  },
  dropdownDownIcon: {
    borderLeft: "1px solid #DEDEE6",
    display: "flex",
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    width: 30,
    alignItems: "center",
    // flexDirection: "column",
    justifyContent: "center",
    fontSize: 16,
  },
  wrapper: {
    position: "relative",
  },
  dropdownContent: {
    position: "absolute",
    zIndex: 1,
    boxShadow: "rgba(129, 148, 167, 0.2) 0px 3px 10px 0px",
    width: "100%",
    background: "white",
    borderRadius: 4,
    marginTop: 2,
    left: 0,
    border: `1px solid rgb(222, 222, 222)`,
    top: 36,
  },
  explorer: {
    overflowY: "scroll",
    maxHeight: 300,
  },
  newFolder: {
    marginTop: 8,
    fontSize: 14,
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    cursor: "pointer",
    color: colors.NEW_BLUE(),
    ":hover": {
      background: colors.NEW_BLUE(0.1),
    },
  },
  orgSelect: {
    fontSize: 14,
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    cursor: "pointer",
    ":hover": {
      background: colors.GREY(0.2),
    },
  },
  main: {
    color: "#241F3A",
    position: "absolute",
    top: 45,
    right: 0,
    left: "unset",
    background: "white",
    width: 300,
    padding: "15px",
    zIndex: 2,
    boxShadow: "rgba(129, 148, 167, 0.2) 0px 3px 10px 0px",
    border: `1px solid rgb(222, 222, 222)`,
    borderRadius: 4,
    boxSizing: "border-box",
  },
});

export default SaveToRefManager;
