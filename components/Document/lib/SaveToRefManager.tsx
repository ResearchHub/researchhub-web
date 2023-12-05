import {
  faAngleDown,
  faSitemap,
  faFolderPlus,
  faUser,
} from "@fortawesome/pro-light-svg-icons";
import {
  faBookmark,
  faArrowRight,
  faEye,
  faMinus,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faFolder,
  faBookmark as solidBookmark,
  faArrowRightToBracket,
  faCheckCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import IconButton from "~/components/Icons/IconButton";
import ProjectExplorer from "~/components/ReferenceManager/lib/ProjectExplorer";
import { StyleSheet, css } from "aphrodite";
import { fetchReferenceOrgProjects } from "~/components/ReferenceManager/references/reference_organizer/api/fetchReferenceOrgProjects";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import colors from "~/config/themes/colors";
import { ID, RhDocumentType } from "~/config/types/root_types";
import API, { generateApiUrl, buildQueryString } from "~/config/api";
import Helpers from "~/config/api/helpers";
import Button from "~/components/Form/Button";
import { GenericDocument, ContentInstance, isPaper } from "./types";
import ALink from "~/components/ALink";
import { ClipLoader } from "react-spinners";
import OrgAvatar from "~/components/Org/OrgAvatar";
import {
  ReferenceProjectsUpsertContextProvider,
  useReferenceProjectUpsertContext,
} from "~/components/ReferenceManager/references/reference_organizer/context/ReferenceProjectsUpsertContext";
import ReferenceProjectsUpsertModal from "~/components/ReferenceManager/references/reference_organizer/ReferenceProjectsUpsertModal";
import { useDispatch } from "react-redux";
import { emptyFncWithMsg, silentEmptyFnc } from "~/config/utils/nullchecks";
import { removeReferenceCitations } from "~/components/ReferenceManager/references/api/removeReferenceCitations";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import { useEffectHandleClick } from "~/config/utils/clickEvent";

interface Project {
  id: number;
  children: Project[];
}

function getFlatListOfProjectIds(projects: Project[]): number[] {
  const ids: number[] = [];

  function extractIds(projects: Project[]) {
    for (const project of projects) {
      ids.push(project.id);
      if (project.children.length) {
        extractIds(project.children);
      }
    }
  }

  extractIds(projects);

  return ids;
}

interface Props {
  contentId: ID;
  contentType: RhDocumentType;
  unifiedDocumentId: ID;
  doc?: any;
}

const saveToRefManagerApi = ({ contentId, orgId, projectId, doc }) => {
  const isDocPaper = isPaper(doc);
  const url = generateApiUrl(
    isDocPaper
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
    .catch((error) => {
      console.log("error", error);
    });
};

interface AlreadySavedProps {
  unifiedDocumentId: ID;
  orgId: ID;
  projectIds: ID[];
  doc: any;
}

const checkWhichProjectsDocIsSavedApi = ({
  orgId,
  unifiedDocumentId,
  projectIds,
  doc,
}: AlreadySavedProps) => {
  const url = generateApiUrl(
    `citation_entry/${unifiedDocumentId}/check_paper_in_reference_manager`,
    `?project_ids=${projectIds.join(",")}`
  );

  return fetch(
    url,
    API.GET_CONFIG(
      undefined,
      orgId ? { "x-organization-id": orgId } : undefined
    )
  )
    .then((res): any => Helpers.parseJSON(res))
    .catch((error) => {
      console.log("error", error);
    });
};

const SaveToRefManager = ({
  contentId,
  contentType,
  unifiedDocumentId,
  doc,
}: Props) => {
  const [orgProjects, setOrgProjects] = useState([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [projectCitationMap, setProjectCitationMap] = useState<{
    [key: string]: Array<string>;
  }>({});
  const { orgs, setCurrentOrg } = useOrgs();
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!isFetchingProjects && selectedOrg && orgProjects.length > 0) {
      const flatList = getFlatListOfProjectIds(orgProjects);
      (async () => {
        const res = await checkWhichProjectsDocIsSavedApi({
          orgId: selectedOrg.id,
          unifiedDocumentId,
          projectIds: flatList,
        });
        setProjectCitationMap(res);
      })();
    }
  }, [selectedOrg, orgProjects, isFetchingProjects]);

  const {
    setIsModalOpen: setIsProjectUpsertModalOpen,
    setProjectValue: setProjectUpsertValue,
    setUpsertPurpose: setProjectUpsertPurpose,
  } = useReferenceProjectUpsertContext();

  useEffect(() => {
    if (selectedOrg) {
      setIsFetchingProjects(true);
      setProjectCitationMap({});
      fetchReferenceOrgProjects({
        onError: () => {
          alert("Failed to fetch projects");
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
  }, [selectedOrg]);

  useEffect(() => {
    if (orgs && orgs.length > 0 && !selectedOrg) {
      setSelectedOrg(orgs[0]);
      // @ts-ignore
      setCurrentOrg(orgs[0]);
    }
  }, [orgs]);

  useEffectHandleClick({
    ref: tooltipRef,
    exclude: [`.trigger-for-save-to-ref-manager`, ".upsert-project-modal"],
    onOutsideClick: () => {
      setIsOpen(false);
    },
  });

  const isSaved = Object.values(projectCitationMap).find(
    (citations) => citations.length > 0
  );
  const savedInProjectIds = Object.keys(projectCitationMap)
    .filter((projectId) => projectCitationMap[projectId].length > 0)
    .map((projectId) => parseInt(projectId));

  return (
    <>
      <ReferenceProjectsUpsertModal
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

      <div className={css(styles.wrapper)}>
        <div id="save-to-ref-manager">
          <PermissionNotificationWrapper
            modalMessage="edit document"
            permissionKey="UpdatePaper"
            loginRequired={true}
            onClick={() => setIsOpen(!isOpen)}
            hideRipples={true}
          >
            <div className="trigger-for-save-to-ref-manager">
              <IconButton variant="round">
                {isSaved ? (
                  <>
                    <FontAwesomeIcon
                      icon={solidBookmark}
                      style={{ marginRight: 3, color: colors.MEDIUM_GREY2() }}
                    />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <div>
                      <FontAwesomeIcon
                        icon={faBookmark}
                        style={{ marginRight: 3 }}
                      />
                    </div>
                    <span>Save</span>
                  </>
                )}
              </IconButton>
            </div>
          </PermissionNotificationWrapper>
        </div>
        {isOpen && (
          <div className={css(styles.main) + " save-ref-open"} ref={tooltipRef}>
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
                    handleSelectProject={(project) => {
                      if (savedInProjectIds.includes(project.id)) {
                        const referenceIds = projectCitationMap[project.id];

                        removeReferenceCitations({
                          onError: emptyFncWithMsg,
                          orgId: selectedOrg!.id,
                          onSuccess: (): void => {
                            setProjectCitationMap({
                              ...projectCitationMap,
                              [project.id]: [],
                            });
                          },
                          payload: {
                            citation_entry_ids: referenceIds,
                          },
                        });
                      } else {
                        saveToRefManagerApi({
                          projectId: project.id,
                          contentId: contentId,
                          orgId: selectedOrg?.id,
                          doc,
                        }).then((res: any) => {
                          projectCitationMap[project.id] = [res.id];
                          setProjectCitationMap({ ...projectCitationMap });
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
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
