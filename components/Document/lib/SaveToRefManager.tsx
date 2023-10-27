import {
  faAngleDown,
  faBookmark,
  faSitemap,
  faUser,
} from "@fortawesome/pro-light-svg-icons";
import {
  faFolder,
  faBookmark as solidBookmark,
  faArrowRightToBracket,
  faCheckCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import IconButton from "~/components/Icons/IconButton";
import ProjectExplorer from "~/components/ReferenceManager/lib/ProjectExplorer";
import { StyleSheet, css } from "aphrodite";
import { fetchReferenceOrgProjects } from "~/components/ReferenceManager/references/reference_organizer/api/fetchReferenceOrgProjects";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import colors from "~/config/themes/colors";
import { ID } from "~/config/types/root_types";
import API, { generateApiUrl, buildQueryString } from "~/config/api";
import Helpers from "~/config/api/helpers";
import Button from "~/components/Form/Button";
import { GenericDocument, ContentInstance } from "./types";
import ALink from "~/components/ALink";
import {
  faArrowRight,
  faEye,
  faMinus,
} from "@fortawesome/pro-regular-svg-icons";
import { ClipLoader } from "react-spinners";
import OrgAvatar from "~/components/Org/OrgAvatar";

interface Props {
  contentId: ID;
  contentType: ContentInstance;
}

const saveToRefManagerApi = ({ paperId, orgId }) => {
  const url = generateApiUrl(`citation_entry/${paperId}/add_paper_as_citation`);

  return fetch(
    url,
    API.POST_CONFIG(
      {},
      undefined,
      orgId ? { "x-organization-id": orgId } : undefined
    )
  )
    .then((res): any => Helpers.parseJSON(res))
    .catch((error) => {
      console.log("error", error);
    });
};

const SaveToRefManager = ({ contentId, contentType }: Props) => {
  const [orgProjects, setOrgProjects] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState<boolean>(false);
  const [isProjectExplorerOpen, setIsProjectExplorerOpen] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<{
    label: string;
    id: ID | null;
    icon: any;
  }>({
    label: "My References",
    id: null,
    icon: (
      <FontAwesomeIcon icon={faUser} style={{ marginRight: 5, fontSize: 16 }} />
    ),
  });
  const { orgs } = useOrgs();

  useEffect(() => {
    if (selectedOrg) {
      fetchReferenceOrgProjects({
        onError: () => {
          alert("Failed to fetch projects");
        },
        onSuccess: (payload): void => {
          setOrgProjects(payload ?? []);
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
    }
  }, [orgs]);

  return (
    <div className={css(styles.wrapper)}>
      <IconButton variant="round" onClick={() => setIsOpen(!isOpen)}>
        {isSaved ? (
          <>
            <FontAwesomeIcon
              icon={solidBookmark}
              style={{ marginRight: 3, color: colors.NEW_GREEN() }}
            />
            <span>Saved</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faBookmark} style={{ marginRight: 3 }} />
            <span>Save</span>
          </>
        )}
      </IconButton>
      {isOpen && (
        <div className={css(styles.main)}>
          <div className={css(styles.title)}>Save to reference manager:</div>
          <div
            className={css(styles.dropdown)}
            onClick={() => {
              setIsProjectExplorerOpen(false);
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
                        className={css(styles.select)}
                        onClick={() => {
                          setSelectedOrg(org);
                          setIsOrgSelectorOpen(false);
                          setSelectedProject({
                            label: "My References",
                            id: null,
                            icon: (
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{ marginRight: 5, fontSize: 16 }}
                              />
                            ),
                          });
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
          <div
            className={css(styles.dropdown)}
            onClick={() => {
              setIsProjectExplorerOpen(!isProjectExplorerOpen);
              setIsOrgSelectorOpen(false);
            }}
          >
            <div className={css(styles.dropdownValue)}>
              {selectedProject.icon}
              {selectedProject.label}
            </div>
            <div className={css(styles.dropdownDownIcon)}>
              <FontAwesomeIcon
                icon={faAngleDown}
                color={colors.MEDIUM_GREY2()}
              />
            </div>
            {isProjectExplorerOpen && (
              <div className={css(styles.dropdownContent)}>
                <div className={css(styles.explorer)}>
                  <div
                    className={css(styles.select)}
                    onClick={() => {
                      setSelectedProject({
                        label: "My References",
                        id: null,
                        icon: (
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{ marginRight: 5, fontSize: 16 }}
                          />
                        ),
                      });
                      setIsProjectExplorerOpen(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ marginRight: 5, fontSize: 16 }}
                    />
                    My References
                  </div>
                  <div
                    className={css(styles.select)}
                    onClick={() => {
                      setSelectedProject({
                        label: "Organization References",
                        id: null,
                        icon: (
                          <FontAwesomeIcon
                            icon={faSitemap}
                            style={{ marginRight: 5, fontSize: 16 }}
                          />
                        ),
                      });
                      setIsProjectExplorerOpen(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faSitemap}
                      style={{ marginRight: 5, fontSize: 16 }}
                    />
                    Organization References
                  </div>
                  <div className={css(styles.divider)}></div>
                  <ProjectExplorer
                    currentOrgProjects={orgProjects}
                    handleClick={({ projectName, projectID }) => {
                      setSelectedProject({
                        label: projectName,
                        id: projectID,
                        icon: (
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ marginRight: 5, fontSize: 16 }}
                            color={"#AAA8B4"}
                          />
                        ),
                      });
                      setIsProjectExplorerOpen(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {isSaved && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "5px",
                justifyContent: "flex-end",
              }}
            >
              {/* <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 5, fontSize: 16 }} /> */}
              {/* <span>Saved </span> */}
              <Button
                variant="text"
                size="small"
                customButtonStyle={styles.removeButton}
                customLabelStyle={styles.removeButtonLabel}
              >
                Remove
              </Button>
              <Button
                size="small"
                customButtonStyle={styles.viewButton}
                customLabelStyle={styles.viewButtonLabel}
                onClick={() =>
                  (window.location.href =
                    "http://localhost:3000/reference-manager/kobe-attiass-notebook/neuromodulators/type-1-modulators")
                }
              >
                {/* <FontAwesomeIcon icon={faEye} style={{ marginRight: 5, fontSize: 16 }} /> */}
                View
                {/* <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: 5, fontSize: 16 }} /> */}
              </Button>
            </div>
          )}
          {!isSaved && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                disabled={isSaving}
                customButtonStyle={styles.saveButton}
                onClick={() => {
                  // setIsSaving(true);
                  setIsSaved(true);
                  setIsOpen(false);
                  saveToRefManagerApi({
                    paperId: contentId,
                    orgId: selectedOrg?.id,
                  }).then(() => {
                    // setIsSaving(false);
                    setIsSaved(true);
                  });
                }}
                size="small"
              >
                {!isSaving ? (
                  <>Save</>
                ) : (
                  <ClipLoader
                    sizeUnit={"px"}
                    size={16}
                    css={{ marginTop: 6 }}
                    color={"white"}
                    loading={true}
                  />
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  savedTriggerBtn: {
    borderColor: colors.NEW_GREEN(),
  },
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
    // border: `1px solid ${colors.MEDIUM_GREY2()}`,
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
    height: 36,
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
    // border: `1px solid rgb(222, 222, 222)`,
    borderRadius: 4,
    marginTop: 2,
    left: 0,
    border: `1px solid rgb(222, 222, 222)`,
    top: 30,
  },
  explorer: {},
  select: {
    fontSize: 14,
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    ":hover": {
      background: "#F0F0F7",
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
