import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  DEFAULT_PROJECT_VALUES,
  ProjectValue,
  useReferenceProjectUpsertContext,
} from "./reference_organizer/context/ReferenceProjectsUpsertContext";
import {
  faFolderPlus,
  faMagnifyingGlass,
  faFileExport,
  faTrashCan,
  faEllipsis,
} from "@fortawesome/pro-light-svg-icons";

import {
  Fragment,
  useState,
  ReactNode,
  useEffect,
  useRef,
  createRef,
  SyntheticEvent,
} from "react";
import { connect } from "react-redux";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { MessageActions } from "~/redux/message";
import { removeReferenceCitations } from "./api/removeReferenceCitations";
import { StyleSheet, css } from "aphrodite";
import { toast } from "react-toastify";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceTabContext } from "./reference_item/context/ReferenceItemDrawerContext";
import { useReferenceUploadDrawerContext } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import { useRouter } from "next/router";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "../basic_page_layout/BasicTogglableNavbarLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { pluralize } from "~/config/utils/misc";
import { removeReferenceProject } from "./reference_organizer/api/removeReferenceProject";
import { useReferenceActiveProjectContext } from "./reference_organizer/context/ReferenceActiveProjectContext";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import colors from "~/config/themes/colors";
import DropdownMenu from "../menu/DropdownMenu";
import DroppableZone from "~/components/DroppableZone";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import Link from "next/link";
import ManageOrgModal from "~/components/Org/ManageOrgModal";
import postUploadFiles from "./api/postUploadFiles";
import QuickModal from "../menu/QuickModal";
import ReactTooltip from "react-tooltip";
import ReferenceItemDrawer from "./reference_item/ReferenceItemDrawer";
import ReferenceManualUploadDrawer from "./reference_uploader/ReferenceManualUploadDrawer";
import ReferencesBibliographyModal from "./reference_bibliography/ReferencesBibliographyModal";
import ReferencesTable, { PreloadRow } from "./reference_table/ReferencesTable";
import withWebSocket from "~/components/withWebSocket";
import FormInput from "~/components/Form/FormInput";
import api, { generateApiUrl } from "~/config/api";
import { fetchCurrentUserReferenceCitations } from "./api/fetchCurrentUserReferenceCitations";
import { useReferencesTableContext } from "./reference_table/context/ReferencesTableContext";
import { GridRowId } from "@mui/x-data-grid";
import { navContext } from "~/components/contexts/NavigationContext";
import Button from "~/components/Form/Button";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { grey } from "@mui/material/colors";
import ReferenceProjectsUpsertModal from "../references/reference_organizer/ReferenceProjectsUpsertModal";
import RefManagerCallouts from "../onboarding/RefManagerCallouts";
import { storeToCookie } from "~/config/utils/storeToCookie";

interface Props {
  showMessage: ({ show, load }) => void;
  wsResponse: string;
  wsConnected: boolean;
  setMessage?: any;
  calloutOpen: boolean;
}

const WRAP_SEARCHBAR_AT_WIDTH = 700;

// TODO: @lightninglu10 - fix TS.
function ReferencesContainer({
  showMessage,
  setMessage,
  wsResponse,
  wsConnected,
  calloutOpen,
}: Props): ReactNode {
  const currentUser = getCurrentUser();

  // const userAllowed = gateKeepCurrentUser({
  //   application: "REFERENCE_MANAGER",
  //   shouldRedirect: true,
  // });
  const { currentOrg, refetchOrgs } = useOrgs();
  const router = useRouter();

  const {
    activeProject,
    currentOrgProjects,
    resetProjectsFetchTime,
    setCurrentOrgProjects,
    setActiveProject,
  } = useReferenceActiveProjectContext();
  const {
    setIsModalOpen: setIsProjectUpsertModalOpen,
    setProjectValue: setProjectUpsertValue,
    setUpsertPurpose: setProjectUpsertPurpose,
  } = useReferenceProjectUpsertContext();
  const {
    setIsDrawerOpen: setIsRefUploadDrawerOpen,
    setProjectID: setProjectIDForUploadDrawer,
  } = useReferenceUploadDrawerContext();

  const [createdReferences, setCreatedReferences] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [isBibModalOpen, setIsBibModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calloutIsOpen, setCalloutIsOpen] = useState<boolean>(
    calloutOpen === undefined || calloutOpen === null
      ? true
      : calloutOpen !== "false"
  );
  const [isRemoveRefModalOpen, setIsRemoveRefModalOpen] =
    useState<boolean>(false);
  const [_loading, setLoading] = useState<boolean>(false);
  const [referencesSearchLoading, setReferencesSearchLoading] =
    useState<boolean>(false);
  const { isRefManagerSidebarOpen, setIsRefManagerSidebarOpen } = navContext();
  const isOnOrgTab = !isEmpty(router.query?.org_refs);
  const [isSearchInputFullWidth, setIsSearchInputFullWidth] =
    useState<boolean>(false);
  const mainContentRef = createRef<HTMLDivElement>();
  const onOrgUpdate = (): void => {
    refetchOrgs();
    setIsOrgModalOpen(false);
  };
  const onUpdateFolderClick = (): void => {
    setProjectUpsertPurpose("update");
    setProjectUpsertValue({
      ...DEFAULT_PROJECT_VALUES,
      ...activeProject,
    });
    setIsProjectUpsertModalOpen(true);
  };

  useEffect(() => {
    setCalloutIsOpen(
      calloutOpen === undefined || calloutOpen === null ? true : calloutOpen
    );
  }, [calloutOpen]);

  const onFileDrop = (acceptedFiles: File[] | any[]): void => {
    const preload: Array<PreloadRow> = [];
    setLoading(true);
    acceptedFiles.map(() => {
      const uuid = window.URL.createObjectURL(new Blob([])).substring(31);
      preload.push({
        citation_type: "LOADING",
        id: uuid,
        created: true,
      });
    });

    setCreatedReferences(preload);
    postUploadFiles({
      acceptedFiles,
      activeProjectID: activeProject?.projectID ?? undefined,
      currentUser: nullthrows(currentUser),
      onError: (): void => {},
      onSuccess: (): void => {
        setLoading(false);
      },
      orgID: nullthrows(currentOrg).id,
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedRows]);

  const { setReferenceTableRowData, referenceTableRowData } =
    useReferencesTableContext();

  const fetchCitationsWithQuery = async (url) => {
    const config = api.GET_CONFIG();
    config.headers["X-organization-id"] = currentOrg?.id.toString();
    const resp = await fetch(url, config);
    const json = await resp.json();
    setReferencesSearchLoading(false);
    const citations = json.results;
    setReferenceTableRowData(citations);
    // setCitations(citations);
    // resetCitations(citations);
  };

  const searchForCitation = async (e: SyntheticEvent) => {
    setReferencesSearchLoading(true);
    if (searchQuery) {
      const url = generateApiUrl(`search/citation`, `?search=${searchQuery}`);
      fetchCitationsWithQuery(url);
    } else {
      await fetchCurrentUserReferenceCitations({
        getCurrentUserCitation: true,
        organizationID: currentOrg.id,
        projectSlug: router.query.slugs.slice(-1),
        projectID: activeProject?.projectID,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: (result) => {
          const citations = result;
          setReferenceTableRowData(citations);
          setReferencesSearchLoading(false);
        },
      });
    }
  };

  const addFolderToChildren = (result) => {
    let newOrgProjects: ProjectValue[] = [...currentOrgProjects];
    if (!result.parent) {
      newOrgProjects.push(result);
    } else {
      const newActiveProject = { ...activeProject };
      newActiveProject.children = [...newActiveProject.children, result];
      setActiveProject(newActiveProject);

      newOrgProjects = setNestedProjects({
        activeProject: newActiveProject,
        allProjects: currentOrgProjects,
      });
    }

    setCurrentOrgProjects(newOrgProjects);
  };

  const setNestedProjects = ({ activeProject, allProjects }) => {
    const newOrgProjects = allProjects.map((proj) => {
      if (proj.id === activeProject.id) {
        return activeProject;
      }
      proj.children = setNestedProjects({
        activeProject,
        allProjects: proj.children,
      });
      return proj;
    });

    return newOrgProjects;
  };

  const onSearchClick = (e) => {
    searchForCitation(e);
  };

  const onEnterClicked = (e) => {
    if (e.key === "Enter") {
      searchForCitation(e);
    }
  };

  // NOTE: calvinhlee - Using useffect with a socket like this looks glaringly bad. Can we explore
  // if there are better solution? @lightninglu10. There's already an error that loops in log.

  useEffect(() => {
    if (wsResponse) {
      const newReferences = [...createdReferences];
      const ind = newReferences.findIndex((reference) => {
        return reference.citation_type === "LOADING";
      });
      const wsJson = JSON.parse(wsResponse);
      const createdCitationJson = wsJson.created_citation;

      if (wsJson.dupe_citation) {
        newReferences.splice(ind, 1);
        toast(
          <div style={{ fontSize: 16, textAlign: "center" }}>
            {"Citation for "} <br />
            <br />
            <strong style={{ fontWeight: 600 }}>
              {createdCitationJson.fields.title}
            </strong>
            <br />
            <br />
            {"already exists!"}
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            progressStyle: { background: colors.NEW_BLUE() },
            hideProgressBar: false,
          }
        );
      } else {
        newReferences[ind] = createdCitationJson;
      }

      setCreatedReferences(newReferences);
    }
  }, [wsResponse]);

  useEffect(() => {
    if (mainContentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // Observe changes
        for (const entry of entries) {
          if (entry.target === mainContentRef.current) {
            const { width } = entry.contentRect;
            if (width < WRAP_SEARCHBAR_AT_WIDTH && !isSearchInputFullWidth) {
              setIsSearchInputFullWidth(true);
            } else if (
              width >= WRAP_SEARCHBAR_AT_WIDTH &&
              isSearchInputFullWidth
            ) {
              setIsSearchInputFullWidth(false);
            }
          }
        }
      });

      // 4. Use the observe() method to start observing the element.
      resizeObserver.observe(mainContentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [mainContentRef]);

  const handleRowSelection = (ids: (string | number)[]) => {
    setSelectedRows(ids);
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const handleDelete = (rowIds: GridRowId | GridRowId[]) => {
    const _rowIds = Array.isArray(rowIds) ? rowIds : [rowIds];

    const folderIds = _rowIds.filter((id) => String(id).includes("folder"));
    const referenceIds = _rowIds.filter((id) => !String(id).includes("folder"));

    removeReferenceCitations({
      onError: emptyFncWithMsg,
      onSuccess: (): void => {
        // setReferencesFetchTime(Date.now());
        const previousCitations = [...referenceTableRowData];
        const newCitations = previousCitations.filter((citation) => {
          return !referenceIds.includes(citation.id);
        });
        setReferenceTableRowData(newCitations);
        setIsRemoveRefModalOpen(false);
      },
      payload: {
        citation_entry_ids: referenceIds,
      },
    });

    folderIds.forEach((projectId) => {
      const intId = parseInt(projectId.split("-folder")[0], 10);
      removeReferenceProject({
        projectID: intId,
        onSuccess: () => {
          resetProjectsFetchTime();

          setIsRemoveRefModalOpen(false);
        },
        onError: emptyFncWithMsg,
      });
    });
  };

  return (
    <>
      <QuickModal
        isOpen={isDeleteModalOpen}
        modalContent={
          <Box sx={{ marginBottom: "16px", height: "120px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "38px",
              }}
            >
              <Typography id="modal-modal-title" variant="subtitle2">
                {`Are you sure you want to remove this folder?`}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{activeProject?.projectName}</Typography>
            </Box>
          </Box>
        }
        modalWidth="300px"
        onPrimaryButtonClick={(): void => {
          removeReferenceProject({
            projectID: activeProject?.projectID,
            onSuccess: () => {
              resetProjectsFetchTime();
              setIsDeleteModalOpen(false);
              router.push(`/reference-manager/${currentOrg?.slug ?? ""}`);
            },
            onError: emptyFncWithMsg,
          });
        }}
        onSecondaryButtonClick={(): void => setIsDeleteModalOpen(false)}
        onClose={(): void => setIsDeleteModalOpen(false)}
        primaryButtonConfig={{ label: "Delete" }}
      />
      <ManageOrgModal
        org={currentOrg}
        isOpen={isOrgModalOpen}
        closeModal={(): void => setIsOrgModalOpen(false)}
        onOrgChange={onOrgUpdate}
      />
      <QuickModal
        isOpen={isRemoveRefModalOpen}
        modalContent={
          <Box sx={{ height: "80px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography id="modal-modal-title" variant="h6">
                {`Remove ${selectedRows.length} selected item${
                  selectedRows.length > 1 ? "s" : ""
                }`}
              </Typography>
            </Box>
          </Box>
        }
        modalWidth="300px"
        onPrimaryButtonClick={() => handleDelete(selectedRows)}
        onSecondaryButtonClick={(): void => setIsRemoveRefModalOpen(false)}
        onClose={(): void => setIsRemoveRefModalOpen(false)}
        primaryButtonConfig={{ label: "Remove" }}
      />
      <ReferencesBibliographyModal
        isOpen={isBibModalOpen}
        onClose={(): void => setIsBibModalOpen(false)}
        selectedReferenceIDs={selectedRows}
      />
      <ReferenceProjectsUpsertModal onUpsertSuccess={addFolderToChildren} />
      <ReferenceManualUploadDrawer key="root-nav" />
      <ReferenceItemDrawer />
      <Box
        flexDirection="row"
        display="flex"
        sx={{
          height: "100%",
          maxWidth: {
            xs: "100vw",
            sm: "calc(100vw - 79px)",
          },
        }}
      >
        <BasicTogglableNavbarLeft
          currentOrgProjects={currentOrgProjects}
          isOpen={isRefManagerSidebarOpen}
          navWidth={LEFT_MAX_NAV_WIDTH}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          openOrgSettingsModal={() => setIsOrgModalOpen(true)}
          setIsOpen={setIsRefManagerSidebarOpen}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: {
              xs: "15px",
              sm: "28px",
            },
            width: "100%",
            overflow: "auto",
            boxSizing: "border-box",
            flex: 1,
          }}
          className={"references-section"}
          ref={mainContentRef}
        >
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ flex: 1 }}>
              {router.query.slug ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    rowGap: "4px",
                  }}
                >
                  {activeProject?.parent_names?.names?.map((name, index) => {
                    const slugsTilNow = router.query.slug
                      .slice(0, index + 1)
                      .join("/");

                    const isActiveProject =
                      index + 1 === activeProject.parent_names?.names?.length;

                    return (
                      <div key={index}>
                        <Link
                          href={`/reference-manager/${currentOrg?.slug}/${slugsTilNow}`}
                          className={css(
                            styles.projectLink,
                            isActiveProject && styles.activeProjectLink
                          )}
                        >
                          {name}
                        </Link>
                        {index !==
                          activeProject.parent_names?.names?.length - 1 && (
                          <span
                            style={{
                              margin: 8,
                              color: "rgb(115, 108, 100)",
                            }}
                          >
                            /
                          </span>
                        )}
                      </div>
                    );
                  })}
                </Box>
              ) : isOnOrgTab ? (
                "Organization References"
              ) : (
                `My References`
              )}
            </Typography>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              multiple
              style={{ display: "none" }}
              onChange={(event) => {
                onFileDrop(Array.from(event?.target?.files ?? []));
              }}
            />

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              {activeProject?.flattenedCollaborators && (
                <AuthorFacePile
                  horizontal
                  margin={-10}
                  imgSize={40}
                  authorProfiles={activeProject?.flattenedCollaborators.map(
                    (collaborator) => {
                      collaborator.authorProfile.user = collaborator;
                      return collaborator.authorProfile;
                    }
                  )}
                />
              )}
              {/* TODO: Temporarily commenting until we time to implement folder permissions */}
              {/* {!isOnOrgTab && (
                  <Button
                    variant="outlined"
                    fontSize="small"
                    size="small"
                    customButtonStyle={styles.shareButton}
                    onClick={
                      onUpdateFolderClick
                    }
                  >
                    <Typography variant="h6" fontSize={"16px"}>
                      {"Update folder"}
                    </Typography>
                  </Button>
                )} */}
            </div>
          </div>

          <Box className="ReferencesContainerMain" sx={{ height: "100%" }}>
            <Box
              className="ReferencesContainerTitleSection"
              sx={{ marginBottom: "32px" }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "15px",
                  width: "100%",
                  ...(isSearchInputFullWidth && { flexWrap: "wrap" }),
                }}
              >
                <DropdownMenu
                  menuItemProps={[
                    {
                      itemLabel: "DOI or URL",
                      onClick: (): void => {
                        setProjectIDForUploadDrawer(
                          activeProject?.projectID ?? null
                        );
                        setIsRefUploadDrawerOpen(true);
                      },
                    },
                    {
                      itemLabel: "Upload PDF(s)",
                      onClick: (): void =>
                        // @ts-ignore unnecessary never handling
                        nullthrows(inputRef?.current).click(),
                    },
                  ]}
                  menuLabel={
                    <Button
                      variant="contained"
                      size="med"
                      customButtonStyle={styles.button}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color="#fff"
                          fontSize="18px"
                          style={{ marginRight: 8 }}
                        />
                        {"Add reference"}
                      </div>
                    </Button>
                  }
                  size={"small"}
                />

                <Button
                  variant="outlined"
                  size="med"
                  customButtonStyle={[styles.button, styles.secondary]}
                  onClick={(e) => {
                    e.preventDefault();
                    setProjectUpsertPurpose("create_sub_project");
                    setProjectUpsertValue({
                      ...DEFAULT_PROJECT_VALUES,
                      projectID: activeProject?.projectID,
                    });
                    setIsProjectUpsertModalOpen(true);
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                      icon={faFolderPlus}
                      fontSize="18px"
                      style={{ marginRight: 8 }}
                    />
                    Create folder
                  </div>
                </Button>
                {selectedRows.length > 0 && (
                  <>
                    <div className={css(styles.divider)}> </div>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <Button
                        variant="outlined"
                        size="med"
                        customButtonStyle={[styles.button, styles.secondary]}
                        onClick={() => setIsBibModalOpen(true)}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FontAwesomeIcon
                            icon={faFileExport}
                            fontSize="18px"
                            style={{ marginRight: 8 }}
                          />
                          Export
                        </div>
                      </Button>
                    </Box>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <Button
                        variant="outlined"
                        size="med"
                        customButtonStyle={[styles.button, styles.secondary]}
                        onClick={(event) => setIsRemoveRefModalOpen(true)}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            fontSize="18px"
                            style={{ marginRight: 8 }}
                          />
                          Delete
                        </div>
                      </Button>
                    </Box>

                    <Box sx={{ display: { xs: "block", md: "none" } }}>
                      <DropdownMenu
                        menuItemProps={[
                          {
                            itemLabel: (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faFileExport}
                                  fontSize="18px"
                                  style={{ marginRight: 8 }}
                                />
                                Export
                              </div>
                            ),
                            onClick: (): void => {
                              setIsBibModalOpen(true);
                            },
                          },
                          {
                            itemLabel: (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  fontSize="18px"
                                  style={{ marginRight: 8 }}
                                />
                                Delete
                              </div>
                            ),
                            onClick: (): void => {
                              setIsRemoveRefModalOpen(true);
                            },
                          },
                        ]}
                        menuLabel={
                          <Button
                            variant="outlined"
                            size="med"
                            customButtonStyle={[
                              styles.button,
                              styles.secondary,
                            ]}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEllipsis}
                                fontSize="28px"
                              />
                            </div>
                          </Button>
                        }
                        size={"small"}
                      />
                    </Box>
                  </>
                )}

                <FormInput
                  placeholder={"Search references"}
                  containerStyle={[
                    styles.formInputContainer,
                    isSearchInputFullWidth &&
                      styles.formInputContainerFullWidth,
                  ]}
                  inputStyle={styles.inputStyle}
                  icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  iconStyles={styles.searchIcon}
                  onSearchClick={onSearchClick}
                  onKeyDown={onEnterClicked}
                  onChange={(id, value) => setSearchQuery(value)}
                />
              </Box>
            </Box>
            <ReferencesTable
              selectedRows={selectedRows}
              createdReferences={createdReferences}
              rowSelectionModel={selectedRows}
              handleFileDrop={onFileDrop}
              handleClearSelection={handleClearSelection}
              handleRowSelection={handleRowSelection}
              handleDelete={(refId: GridRowId) => {
                setSelectedRows([refId]);
                setIsRemoveRefModalOpen(true);
              }}
              loading={referencesSearchLoading}
            />
          </Box>
        </Box>
        {/* </DroppableZone> */}
        <ReactTooltip effect="solid" id="button-tooltips" />
      </Box>
      <div>
        {calloutIsOpen && (
          <RefManagerCallouts
            handleClose={() => {
              setCalloutIsOpen(false);
              storeToCookie({ key: "callout_open", value: "false" });
              window.localStorage.setItem("callout_open", "false");
            }}
          />
        )}
      </div>
      {/* <ToastContainer
          autoClose={true}
          closeOnClick
          hideProgressBar={false}
          newestOnTop
          containerId={"reference-toast"}
          position="top-center"
          autoClose={5000}
          progressStyle={{ background: colors.NEW_BLUE() }}
        ></ToastContainer> */}
    </>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    marginLeft: 16,
    color: colors.BLACK(),
    border: "none",
    background: "unset",
  },
  projectLink: {
    textDecoration: "none",
    color: "rgb(115, 108, 100)",

    ":hover": {
      color: colors.BLACK(),
      textDecoration: "underline",
    },
  },
  divider: {
    borderLeft: `1px solid ${colors.MEDIUM_GREY2(0.5)}`,
    height: "33px",
  },
  activeProjectLink: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  button: {
    fontSize: 14,
    alignItems: "center",
    display: "flex",
    lineHeight: 1.0,
    padding: "8px 16px",
    height: 36,
    boxSizing: "border-box",
    textWrap: "nowrap",
  },
  secondary: {
    border: `1px solid ${grey[700]}`,
    background: "#fff",
    color: colors.BLACK(),
    ":hover": {
      background: grey[100],
    },
  },
  trashContainer: {
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: 40,
    borderRadius: 4,

    ":hover": {
      background: "#F1F5FF",
    },
  },
  formInputContainer: {
    minHeight: "unset",
    borderRadius: 4,
    height: 40,
    margin: 0,
    marginLeft: "auto",
    // width: "unset",
    maxWidth: 400,
    // flex: "1 1 40% !important",
  },
  formInputContainerFullWidth: {
    width: "100%",
    maxWidth: "unset",
    marginLeft: "unset",
    marginTop: 15,
    // flex: "1 1 100% !important",
  },
  inputStyle: {
    fontSize: 14,
    borderRadius: 4,
    paddingLeft: 16,
    paddingRight: 45,
    height: "100%",
    boxSizing: "border-box",
    cursor: "text",

    ":hover": {
      borderColor: "#E8E8F2",
    },
    ":focus": {
      borderColor: "#E8E8F2",
    },
  },
  searchIcon: {
    left: "unset",
    right: 0,
    padding: "0px 16px",
    cursor: "pointer",
    pointerEvents: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default withWebSocket(
  // @ts-ignore - faulty legacy connect hook
  connect(null, mapDispatchToProps)(ReferencesContainer)
);
