import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  DEFAULT_PROJECT_VALUES,
  useReferenceProjectUpsertContext,
} from "./reference_organizer/context/ReferenceProjectsUpsertContext";
import {
  faFolderPlus,
  faMagnifyingGlass,
  faPlus,
  faFileExport,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
  Fragment,
  useState,
  ReactNode,
  useEffect,
  useRef,
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
import Button from "~/components/Form/Button";
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

interface Props {
  showMessage: ({ show, load }) => void;
  wsResponse: string;
  wsConnected: boolean;
  setMessage?: any;
}

// TODO: @lightninglu10 - fix TS.
function ReferencesContainer({
  showMessage,
  setMessage,
  wsResponse,
  wsConnected,
}: Props): ReactNode {
  const currentUser = getCurrentUser();

  const userAllowed = gateKeepCurrentUser({
    application: "REFERENCE_MANAGER",
    shouldRedirect: true,
  });
  const { currentOrg, refetchOrgs } = useOrgs();
  const router = useRouter();

  const { activeProject, currentOrgProjects, resetProjectsFetchTime } =
    useReferenceActiveProjectContext();
  const { setReferencesFetchTime } = useReferenceTabContext();
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
  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(true);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [isBibModalOpen, setIsBibModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRemoveRefModalOpen, setIsRemoveRefModalOpen] =
    useState<boolean>(false);
  const [_loading, setLoading] = useState<boolean>(false);
  const [referencesSearchLoading, setReferencesSearchLoading] =
    useState<boolean>(false);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;
  const isOnOrgTab = !isEmpty(router.query?.org_refs);
  const isOnMyRefs = !isEmpty(router.query?.my_refs);

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

  const onFileDrop = (acceptedFiles: File[] | any[]): void => {
    setLoading(true);
    postUploadFiles({
      acceptedFiles,
      activeProjectID: activeProject?.projectID ?? undefined,
      currentUser: nullthrows(currentUser),
      onError: (): void => {},
      onSuccess: (): void => {
        const preload: Array<PreloadRow> = [];
        acceptedFiles.map(() => {
          const uuid = window.URL.createObjectURL(new Blob([])).substring(31);
          preload.push({
            citation_type: "LOADING",
            id: uuid,
            created: true,
          });
        });

        setCreatedReferences(preload);
        setLoading(false);
      },
      orgID: nullthrows(currentOrg).id,
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedRows]);

  const { setReferenceTableRowData } = useReferencesTableContext();

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
        setReferencesFetchTime(Date.now());
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

  if (!userAllowed) {
    return <Fragment />;
  } else {
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
                <Typography variant="h6">
                  {activeProject?.projectName}
                </Typography>
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
        <ReferenceManualUploadDrawer key="root-nav" />
        <ReferenceItemDrawer />
        <Box flexDirection="row" display="flex" maxWidth={"calc(100vw - 79px)"}>
          <BasicTogglableNavbarLeft
            currentOrgProjects={currentOrgProjects}
            isOpen={isLeftNavOpen}
            navWidth={leftNavWidth}
            setIsOpen={setIsLeftNavOpen}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 32px",
              width: "100%",
              overflow: "auto",
              boxSizing: "border-box",
              flex: 1,
            }}
            className={"references-section"}
          >
            <div
              style={{
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">
                {router.query.slug ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {router.query.slug.map((name, index) => {
                      const slugsTilNow = router.query.slug
                        .slice(0, index + 1)
                        .join("/");

                      const isActiveProject =
                        index + 1 === router.query.slug?.length;
                      return (
                        <div>
                          <Link
                            href={`/reference-manager/${currentOrg?.slug}/${slugsTilNow}`}
                            className={css(
                              styles.projectLink,
                              isActiveProject && styles.activeProjectLink
                            )}
                          >
                            {name}
                          </Link>
                          {index !== router.query.slug?.length - 1 && (
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
                {activeProject?.collaborators && (
                  <AuthorFacePile
                    horizontal
                    margin={-10}
                    imgSize={40}
                    authorProfiles={activeProject?.collaborators.map(
                      (collaborator) => {
                        collaborator.authorProfile.user = collaborator;
                        return collaborator.authorProfile;
                      }
                    )}
                  />
                )}
                {(isOnOrgTab || !isEmpty(router.query.slug)) && (
                  <Button
                    variant="outlined"
                    fontSize="small"
                    size="small"
                    customButtonStyle={styles.shareButton}
                    onClick={
                      isOnOrgTab
                        ? () => setIsOrgModalOpen(true)
                        : onUpdateFolderClick
                    }
                  >
                    <Typography variant="h6" fontSize={"16px"}>
                      {isOnOrgTab ? "Update organization" : "Update folder"}
                    </Typography>
                  </Button>
                )}
              </div>
            </div>

            <Box className="ReferencesContainerMain">
              <Box className="ReferencesContainerTitleSection">
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    height: 44,
                    marginBottom: "20px",
                    width: "100%",
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
                      <div className={css(styles.button)}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color="#fff"
                          fontSize="20px"
                          style={{ marginRight: 8 }}
                        />
                        {"Add reference"}
                      </div>
                    }
                    size={"small"}
                  />

                  <div
                    className={css(styles.button, styles.secondary)}
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
                    <FontAwesomeIcon
                      icon={faFolderPlus}
                      color={colors.NEW_BLUE(1)}
                      fontSize="20px"
                      style={{ marginRight: 8 }}
                    />
                    {isOnOrgTab || isOnMyRefs
                      ? "Create folder"
                      : "Create folder"}
                  </div>
                  {selectedRows.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                      <Tooltip title="Export" placement="top">
                        <IconButton
                          aria-label="Export references"
                          onClick={() => setIsBibModalOpen(true)}
                          sx={{
                            padding: 1,
                            fontSize: "22px",
                            "&:hover": {
                              background: "rgba(25, 118, 210, 0.04) !important",
                            },
                          }}
                        >
                          <FontAwesomeIcon icon={faFileExport} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton
                          aria-label="Delete references"
                          onClick={(event) => setIsRemoveRefModalOpen(true)}
                          sx={{
                            padding: 1,
                            fontSize: "22px",
                            "&:hover": {
                              background: "rgba(25, 118, 210, 0.04) !important",
                            },
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}

                  <FormInput
                    placeholder={"Search for a reference"}
                    containerStyle={styles.formInputContainer}
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
  activeProjectLink: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  button: {
    alignItems: "center",
    padding: 16,
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    boxSizing: "border-box",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    height: 40,
    justifyContent: "center",
  },
  secondary: {
    border: `1px solid ${colors.NEW_BLUE()}`,
    background: "#fff",
    color: colors.NEW_BLUE(),
    marginRight: 8,
    marginLeft: 16,
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
