import { Box, Typography } from "@mui/material";
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
  faTimes,
  faPencilAlt,
  faPencilSquare,
  faPenToSquare,
} from "@fortawesome/pro-light-svg-icons";

import {
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
import { useReferenceUploadDrawerContext } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import { useRouter } from "next/router";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
} from "../basic_page_layout/BasicTogglableNavbarLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { removeReferenceProject } from "./reference_organizer/api/removeReferenceProject";
import { useReferenceActiveProjectContext } from "./reference_organizer/context/ReferenceActiveProjectContext";
import config from "~/components/Document/lib/config";
import colors from "~/config/themes/colors";
import DropdownMenu from "../menu/DropdownMenu";
import Link from "next/link";
import ManageOrgModal from "~/components/Org/ManageOrgModal";
import postUploadPDFFiles from "./api/postUploadPDFFiles";
import QuickModal from "../menu/QuickModal";
import ReactTooltip from "react-tooltip";
import ReferenceItemDrawer from "./reference_item/ReferenceItemDrawer";
import ReferenceManualUploadDrawer from "./reference_uploader/ReferenceManualUploadDrawer";
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
import DocumentViewer from "~/components/Document/DocumentViewer";
import ReferenceImportLibraryModal from "./reference_import_library_modal/ReferenceImportLibraryModal";
import {
  downloadBibliography,
  formatBibliography,
} from "./reference_bibliography/export";
import ReferencesBibliographyModal from "./reference_bibliography/ReferencesBibliographyModal";
import fetchPostFromS3 from "~/components/Document/api/fetchPostFromS3";
import {
  useDocument,
  useDocumentMetadata,
} from "~/components/Document/lib/useHooks";
import { fetchDocumentByType } from "~/components/Document/lib/fetchDocumentByType";
import fetchDocumentMetadata from "~/components/Document/api/fetchDocumentMetadata";
import DocumentPlaceholder from "~/components/Document/lib/Placeholders/DocumentPlaceholder";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import {
  DocumentContext,
  DocumentPreferences,
} from "~/components/Document/lib/DocumentContext";

interface Props {
  showMessage: ({ show, load }) => void;
  wsResponse: string;
  wsConnected: boolean;
  setMessage?: any;
  calloutOpen: boolean;
}

const WRAP_SEARCHBAR_AT_WIDTH = 700;

function DocumentContainer({ tab, shouldDisplay }) {
  const [postHtml, setPostHtml] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [metadata, setMetadata] = useState();
  const [documentData, setDocumentData] = useState(false);
  const [docPreferences, setDocPreferences] = useState<DocumentPreferences>({
    comments: "all",
  });
  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [documentType, setDocumentType] = useState("paper");

  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  }) as [Post | null, Function];

  // currently there's only a post or a paper
  // there should be a better way to do this -- the type should come from the backend and the FE should just render the type
  const tabIsPost = tab.related_unified_doc.document_type === "DISCUSSION";

  useEffect(() => {
    (async () => {
      try {
        let documentType = "";
        // Right now we only support two attachment types
        if (tab.attachment.includes("uploads/post_discussion")) {
          documentType = "post";
          setDocumentType(documentType);
        } else if (tab.attachment.includes("citation_entry/attachment")) {
          documentType = "paper";
          setDocumentType(documentType);
        }

        const documentId = tabIsPost
          ? tab.related_unified_doc?.documents[0]?.id
          : tab.related_unified_doc?.documents?.id;
        const unifiedDocId = tab.related_unified_doc?.id;
        const _documentData = await fetchDocumentByType({
          documentType,
          documentId,
        });
        const _metadata = await fetchDocumentMetadata({
          unifiedDocId,
        });

        setMetadata(_metadata);
        setDocumentData(_documentData);

        if (tabIsPost) {
          const postHtml = await fetchPostFromS3({
            s3Url: tab.attachment,
          });
          setPostHtml(postHtml);
        }
        setIsReady(true);
      } catch (error) {
        console.log("Error fetching post. Error: ", error);
        setIsReady(true);
      }
    })();
  }, [tab]);

  if (!isReady) {
    return (
      <div className={css(styles.loadingWrapper)}>
        <DocumentPlaceholder />
      </div>
    );
  }

  return (
    <div className={css(styles.documentContainer)}>
      <DocumentContext.Provider
        value={{
          metadata: documentMetadata,
          documentType: tabIsPost ? "post" : "paper",
          preferences: docPreferences,
          updateMetadata: setDocumentMetadata,
          setPreference: ({ key, value }) =>
            setDocPreferences({ ...docPreferences, [key]: value }),
        }}
      >
        <DocumentPageLayout
          document={document}
          // errorCode={errorCode}
          metadata={documentMetadata}
          headerContentWrapperClass={css(styles.headerContentWrapperClass)}
          noHorizontalTabBar
          noLineItems
          referenceManagerView
          documentType={tabIsPost ? "post" : "paper"}
          topAreaClass={[css(styles.topAreaClass)]}
          documentPageClass={[
            css(
              styles.noDisplay,
              styles.overflowHidden,
              shouldDisplay && styles.documentViewerDisplay
            ),
          ]}
        >
          <DocumentViewer
            pdfUrl={tab.attachment}
            postHtml={postHtml}
            documentViewerClass={[
              styles.documentViewerClass,
              shouldDisplay && styles.display,
            ]}
            withControls={false}
            referenceItemDatum={tab}
            citationInstance={{ id: tab.id, type: "citationentry" }}
            documentInstance={
              tab.related_unified_doc
                ? {
                    id: tab.related_unified_doc?.documents[0]?.id,
                    type: tabIsPost ? "researchhubpost" : "paper",
                  }
                : undefined
            }
          />
        </DocumentPageLayout>
      </DocumentContext.Provider>
    </div>
  );
}

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
    isDeleteModalOpen: isDeleteModalOpenLeftSide,
    setIsDeleteModalOpen: setIsDeleteModalOpenLeftSide,
    deleteProject,
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
  const [droppedBibTeXFiles, setDroppedBibTeXFiles] = useState<File[]>([]);
  const [isImportLibModalOpen, setIsImportLibModalOpen] =
    useState<boolean>(false);
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

  const canEdit =
    activeProject?.status === "full_access" ||
    activeProject?.current_user_is_admin;

  const onGenericFileDrop = (acceptedFiles: File[] | any[]): void => {
    if (acceptedFiles.length < 1) {
      return;
    }

    // if they're PDFs, call `onPDFFileDrop`
    const isPDF = acceptedFiles.some(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/x-pdf" ||
        file.name.endsWith(".pdf")
    );
    if (isPDF) {
      onPDFFileDrop(acceptedFiles);
      return;
    }

    // otherwise if there's .bib, open the import modal
    const isBib = acceptedFiles.some((file) => file.name.endsWith(".bib"));
    if (isBib) {
      const bibFiles = acceptedFiles.filter((file) =>
        file.name.endsWith(".bib")
      );
      setDroppedBibTeXFiles(bibFiles);
      setIsImportLibModalOpen(true);
    }
  };

  const onPDFFileDrop = (acceptedFiles: File[] | any[]): void => {
    if (!canEdit) {
      toast(
        <div style={{ fontSize: 16, textAlign: "left" }}>
          You are not allowed to add references in this folder.
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          progressStyle: { background: colors.NEW_BLUE() },
          hideProgressBar: false,
        }
      );
      return null;
    }
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
    postUploadPDFFiles({
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

  /**
   * Format and download the references into a file
   */
  const onExportReferences = (format: "BibTeX" | "RIS"): void => {
    const selected = referenceTableRowData.filter((row) =>
      selectedRows.includes(row.id!)
    );
    const formatted = formatBibliography(selected, format);

    downloadBibliography(formatted, format);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedRows]);

  const {
    setReferenceTableRowData,
    setReferencesContextLoading,
    referenceTableRowData,
    openedTabs,
    activeTab,
    openTabIndex,
    setOpenTabIndex,
    setActiveTab,
    removeTab,
  } = useReferencesTableContext();

  const fetchCitationsWithQuery = async (url) => {
    const config = api.GET_CONFIG();
    config.headers["X-organization-id"] = currentOrg?.id.toString();
    const resp = await fetch(url, config);
    const json = await resp.json();
    setReferencesSearchLoading(false);
    const citations = json.results;
    setReferenceTableRowData(citations);
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
        projectSlug: router.query.slugs?.slice(-1),
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
      orgId: currentOrg!.id,
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

  const renderReferencesContainer = () => {
    return (
      <Box
        sx={{
          height: "100%",
          padding: {
            xs: "15px",
            sm: "28px",
          },
        }}
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
                {activeProject?.parent_names?.names &&
                  (activeProject.status === "full_access" ||
                    activeProject?.current_user_is_admin) && (
                    <Button
                      variant="outlined"
                      fontSize="small"
                      size="small"
                      customButtonStyle={styles.shareButton}
                      onClick={onUpdateFolderClick}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                      {/* <Typography variant="h6" fontSize={"16px"}>
                  {"Update folder"}
                </Typography> */}
                    </Button>
                  )}
              </Box>
            ) : (
              "My Library"
            )}
          </Typography>
          {/* Input for PDF Files */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            style={{ display: "none" }}
            onChange={(event) => {
              onPDFFileDrop(Array.from(event?.target?.files ?? []));
            }}
          />
          {/* Modal for importing reference library */}
          <ReferenceImportLibraryModal
            isOpen={isImportLibModalOpen}
            droppedBibTeXFiles={droppedBibTeXFiles}
            onClose={({ success }) => {
              setIsImportLibModalOpen(false);
              if (success) {
                // refetch
                setReferencesContextLoading(true);
                setReferenceTableRowData([]);
                fetchCurrentUserReferenceCitations({
                  onSuccess: (payload: any) => {
                    setReferenceTableRowData(payload);
                    setReferencesContextLoading(false);
                  },
                  onError: () => {
                    emptyFncWithMsg("Failed to fetch references");
                    setReferencesContextLoading(false);
                  },
                  organizationID: currentOrg?.id,
                  // @ts-ignore
                  projectID: activeProject?.projectID,
                  projectSlug: router.query.slug?.slice(-1)[0],
                  getCurrentUserCitation: !isEmpty(router.query?.my_refs),
                });
              }
            }}
          />
        </div>

        <Box
          className="ReferencesContainerMain"
          sx={{ height: "calc(100% - 30px)" }}
        >
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
              {canEdit && (
                <>
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
                      {
                        itemLabel: "Import Library",
                        subMenuItems: [
                          {
                            itemLabel: "BibTeX (.bib)",
                            onClick: (): void => {
                              setIsImportLibModalOpen(true);
                            },
                          },
                        ],
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
                          {"Add References"}
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
                      Create Folder
                    </div>
                  </Button>
                  {selectedRows.length > 0 && (
                    <>
                      <div className={css(styles.divider)}> </div>
                      <Box sx={{ display: { xs: "none", md: "block" } }}>
                        <DropdownMenu
                          menuItemProps={[
                            {
                              itemLabel: "Bibliography (APA)",
                              onClick: (): void => {
                                setIsBibModalOpen(true);
                              },
                            },
                            {
                              itemLabel: "BibTeX (.bib)",
                              onClick: (): void => {
                                onExportReferences("BibTeX");
                              },
                            },
                            {
                              itemLabel: "RIS (.ris)",
                              onClick: (): void => {
                                onExportReferences("RIS");
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
                                  icon={faFileExport}
                                  fontSize="18px"
                                  style={{ marginRight: 8 }}
                                />
                                Export
                              </div>
                            </Button>
                          }
                          size={"small"}
                        />
                      </Box>
                      <Box sx={{ display: { xs: "none", md: "block" } }}>
                        <Button
                          variant="outlined"
                          size="med"
                          customButtonStyle={[styles.button, styles.secondary]}
                          onClick={(event) => setIsRemoveRefModalOpen(true)}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                              subMenuItems: [
                                {
                                  itemLabel: "Bibliography (APA)",
                                  onClick: (): void => {
                                    setIsBibModalOpen(true);
                                  },
                                },
                                {
                                  itemLabel: "BibTeX (.bib)",
                                  onClick: (): void => {
                                    onExportReferences("BibTeX");
                                  },
                                },
                                {
                                  itemLabel: "RIS (.ris)",
                                  onClick: (): void => {
                                    onExportReferences("RIS");
                                  },
                                },
                              ],
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
                </>
              )}

              <FormInput
                placeholder={"Search references"}
                containerStyle={[
                  styles.formInputContainer,
                  isSearchInputFullWidth && styles.formInputContainerFullWidth,
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
            handleFileDrop={onGenericFileDrop}
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
    );
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

      <QuickModal
        isOpen={isDeleteModalOpenLeftSide}
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
              <Typography variant="h6">{deleteProject?.projectName}</Typography>
            </Box>
          </Box>
        }
        modalWidth="300px"
        onPrimaryButtonClick={(): void => {
          removeReferenceProject({
            projectID: deleteProject?.id,
            onSuccess: () => {
              resetProjectsFetchTime();
              setIsDeleteModalOpenLeftSide(false);
              if (activeProject?.projectID === deleteProject.id) {
                router.push(`/reference-manager/${currentOrg?.slug ?? ""}`);
              }
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
          canEdit={canEdit}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          openOrgSettingsModal={() => setIsOrgModalOpen(true)}
          setIsOpen={setIsRefManagerSidebarOpen}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflow: "auto",
            boxSizing: "border-box",
            flex: 1,
            overflow: "hidden",
          }}
          className={"references-section"}
          ref={mainContentRef}
        >
          {openedTabs.length > 0 ? (
            <div>
              <div className={css(styles.tabs)}>
                <div
                  className={css(
                    styles.tab,
                    activeTab === "all-references" && styles.activeTab
                  )}
                  onClick={() => {
                    setOpenTabIndex(null);
                    setActiveTab("all-references");
                  }}
                >
                  <div className={css(styles.tabName)}>All References</div>
                  <div className={css(styles.close, styles.noHover)}>
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ color: "#FAFAFC" }}
                      // style={{ display: "none" }}
                    />
                  </div>
                </div>
                {openedTabs.map(({ title: tabName, clientId }, index) => {
                  return (
                    <div
                      className={css(
                        styles.tab,
                        activeTab === clientId && styles.activeTab
                      )}
                      onClick={() => {
                        setOpenTabIndex(index);
                        setActiveTab(clientId);
                      }}
                    >
                      <div className={css(styles.tabName)}>{tabName}</div>
                      <div
                        className={css(styles.close)}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTab({ index });
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {activeTab === "all-references"
                ? renderReferencesContainer()
                : openedTabs.map((tab, index) => {
                    return (
                      <DocumentContainer
                        tab={tab}
                        shouldDisplay={openTabIndex === index}
                      />
                    );
                  })}
            </div>
          ) : (
            renderReferencesContainer()
          )}
        </Box>
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
    </>
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    background: "white",
    maxWidth: config.width,
    margin: "75px auto 0 auto",
  },
  topAreaClass: {
    // paddingLeft:
    maxWidth: 860,
    margin: "0 auto",
  },
  shareButton: {
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
  overflowHidden: {
    overflow: "hidden",
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
  headerContentWrapperClass: {
    // paddingLeft: 50,

    "@media only screen and (min-width: 768px)": {
      paddingBottom: 25,
    },

    "@media only screen and (max-width:1023px)": {
      paddingLeft: 0,
    },
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
  noDisplay: {
    display: "none",
  },
  documentViewerDisplay: {
    display: "unset",
  },
  documentViewerClass: {
    // overflow: "auto",
    minHeight: "calc(100vh - 45px - 68px)",
    display: "flex",
    justifyContent: "center",
    display: "none",
  },
  display: {
    display: "flex",
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
  tabs: {
    display: "flex",
    alignItems: "center",
    background: "#F5F5F9",
    overflow: "auto",
  },
  close: {
    marginLeft: "auto",
    padding: "4px 6px",
    borderRadius: 4,
    ":hover": {
      background: colors.GREY_LINE(1),
    },
  },
  documentContainer: {
    position: "relative",
    paddingLeft: 16,
    paddingRight: 16,
  },
  linkToPublicPage: {
    position: "absolute",
    zIndex: 4,
    top: 16,
    right: 16,
  },
  noHover: {
    ":hover": {
      background: "unset",
    },
  },
  tabName: {
    marginRight: 16,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  tab: {
    padding: "8px 12px",
    paddingRight: 8,
    minWidth: 200,
    background: "#FAFAFC",
    border: `1px solid ${colors.GREY_LINE(1)}`,
    borderLeft: 0,
    borderTop: 0,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  activeTab: {
    borderBottom: 0,
    background: "#fff",
    borderTop: `2px solid ${colors.NEW_BLUE(1)}`,
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
