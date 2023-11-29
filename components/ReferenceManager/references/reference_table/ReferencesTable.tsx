import { useEffect, useState, useRef } from "react";
import {
  DataGrid,
  GridCell,
  GridRow,
  GridRowId,
  GridSkeletonCell,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { columnsFormat } from "./utils/referenceTableFormat";
import { fetchCurrentUserReferenceCitations } from "../api/fetchCurrentUserReferenceCitations";
import {
  ReferenceTableRowDataType,
  formatReferenceRowData,
  formatLoading,
} from "./utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import {
  nullthrows,
  emptyFncWithMsg,
  isEmpty,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { DATA_GRID_STYLE_OVERRIDE } from "../styles/ReferencesTableStyles";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";
import { useReferencesTableContext } from "./context/ReferencesTableContext";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import colors from "~/config/themes/colors";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";
import DroppableZone from "~/components/DroppableZone";
import { ID } from "~/config/types/root_types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import Stack from "@mui/material/Stack";
import OpenWithOutlinedIcon from "@mui/icons-material/OpenWithOutlined";
import ReferenceItemOptsDropdown from "../reference_item/ReferenceItemOptsDropdown";
import { useHasTouchCapability } from "~/config/utils/device";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { StyleSheet, css } from "aphrodite";

type Props = {
  createdReferences: any[];
  rowSelectionModel: (string | number)[];
  handleFileDrop: (files: any[]) => void;
  handleRowSelection: (ref: any) => void;
  handleDelete: (refId: GridRowId) => void;
  handleClearSelection: () => void;
  loading?: boolean | undefined;
  selectedRows: GridRowId[];
};

export type PreloadRow = {
  citation_type: string;
  id: string;
  created: boolean;
};

// TODO: @lightninglu10 - ReferenceTableRowDataType became worthless after updating this component. We need to address this
export default function ReferencesTable({
  createdReferences,
  handleFileDrop,
  rowSelectionModel,
  selectedRows,
  handleRowSelection,
  handleClearSelection,
  handleDelete,
  loading,
}: Props) {
  const {
    setIsDrawerOpen,
    referenceItemDatum,
    setReferenceItemDatum,
    referencesFetchTime,
  } = useReferenceTabContext();
  const {
    referenceTableRowData,
    setReferenceTableRowData,
    referencesContextLoading,
    setReferencesContextLoading,
    rowDraggedOver,
    setRowDraggedOver,
    setRowDragged,
    rowDropped,
    openTab,
  } = useReferencesTableContext();
  const [isFetchingReferences, setIsFetchingReferences] =
    useState<boolean>(true);

  const [showDroppableOverlay, setShowDroppableOverlay] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [rowHovered, setRowHovered] = useState<null | ID>(null);
  const { currentOrg } = useOrgs();
  const hasTouchCapability = useHasTouchCapability();
  const tableRef = useRef(null);

  const router = useRouter();
  const apiRef = useGridApiRef();
  const dropzoneId = "dropzone";

  // useEffect(() => {
  //   const dragEventHandler = (e) => {
  //     const insideTable = e.target.role === "cell";
  //     const insideDropzone = e.target.id === dropzoneId;
  //     console.log(e);
  //     console.log(insideTable);
  //     console.log(insideDropzone);
  //     if (!insideDropzone) {
  //       if (!insideTable) {
  //         e.preventDefault();
  //         e.dataTransfer.effectAllowed = "none";
  //         e.dataTransfer.dropEffect = "none";
  //       }
  //     }
  //   };

  //   // window.addEventListener("dragenter", dragEventHandler, false)
  //   // window.addEventListener("dragover", dragEventHandler, false)
  //   // window.addEventListener("drop", dragEventHandler, false)
  //   ["dragenter", "dragover", "drop"].forEach((ev) =>
  //     window.addEventListener(ev, dragEventHandler, false)
  //   );
  // }, []);

  const openFolder = ({ row, event }) => {
    let url = `/reference-manager/${
      router.query.organization
    }/${router.query!.slug!.join("/")}/${row.slug}`;

    if (row.id.includes("parent")) {
      url = `/reference-manager/${router.query.organization}/${router.query.slug
        ?.slice(0, router.query.slug.length - 2)
        .join("/")}/${row.slug}`;
    }

    if (event && event.metaKey) {
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  const {
    activeProject,
    setActiveProject,
    setCurrentOrgProjects,
    isFetchingProjects,
    setIsFetchingProjects,
  } = useReferenceActiveProjectContext();

  // NOTE: current we are assuming that citations only belong to users. In the future it may belong to orgs
  const user = getCurrentUser();
  const pathRef = useRef<any>(null);

  useEffect(() => {
    const shouldFetch = router.asPath !== pathRef.current && currentOrg?.id;
    if (shouldFetch) {
      setIsFetchingReferences(true);
      setReferenceTableRowData([]);
      fetchCurrentUserReferenceCitations({
        onSuccess: (payload: any) => {
          setReferenceTableRowData(payload);
          setIsFetchingReferences(false);
          setReferencesContextLoading(false);
        },
        onError: () => {
          emptyFncWithMsg("Failed to fetch references");
          setIsFetchingReferences(false);
          setReferencesContextLoading(false);
        },
        organizationID: currentOrg?.id,
        // @ts-ignore
        projectID: activeProject?.projectID,
        projectSlug: router.query.slug?.slice(-1)[0],
        getCurrentUserCitation: !isEmpty(router.query?.my_refs),
      });

      pathRef.current = router.asPath;
    }
  }, [
    fetchCurrentUserReferenceCitations,
    user?.id,
    referencesFetchTime,
    currentOrg,
    activeProject?.projectID,
    isFetchingProjects,
    router.query.org_refs,
    router.query.slug,
    router.asPath,
  ]);

  function combineAndDeduplicate(arr1, arr2) {
    const combinedArray = [...arr1, ...arr2];
    const result = [];
    const seenIds = new Set();
    for (const item of combinedArray) {
      if (!seenIds.has(item.id)) {
        result.push(item);
        seenIds.add(item.id);
      }
    }
    return result;
  }

  useEffect(() => {
    const originalReferenceTable = [];

    referenceTableRowData.forEach((ref) => {
      if (!ref.created) {
        originalReferenceTable.push(ref);
      }
    });
    const newReferences = combineAndDeduplicate(
      createdReferences,
      originalReferenceTable
    );

    setReferenceTableRowData(newReferences);
  }, [createdReferences]);

  // NOTE: calvinhlee - Please check type here @lightninglu10. Assuming parent_data doesn't exist in the type. I have a feeling it's buggy somewhere
  const parentProject = Boolean(activeProject?.parent_data)
    ? {
        ...activeProject?.parent_data,
        parentFolder: true,
        title: activeProject?.parent_data?.project_name,
        rawId: activeProject?.parent_data?.id,
        id: `${activeProject?.parent_data?.id}-folder-parent`,
      }
    : null;

  const handleSingleClick = (params, event, _details): void => {
    handleOpenAction({ row: params.row, id: params.id });
  };

  const handleOpenAction = ({ id, row }): void => {
    if (row.is_loading) return;

    const rowId = id.toString();
    if (rowId.includes("folder")) {
      openFolder({ row: row, event });
    } else {
      setReferenceItemDatum({
        ...nullthrows(
          referenceTableRowData.find((item) => item.id === row?.id)
        ),
      });

      openTab(row.raw_data);
    }
  };

  const handleMetadataAction = ({ event, row }): void => {
    event.stopPropagation();
    setReferenceItemDatum(row);
    setIsDrawerOpen(true);
  };

  const isLoading =
    isFetchingProjects || isFetchingReferences || referencesContextLoading;

  const formattedReferenceRows = !isLoading
    ? nullthrows(
        formatReferenceRowData(
          referenceTableRowData,
          // NOTE: calvinhlee - Please check type here @lightninglu10. same here.
          activeProject?.children?.map((child) => {
            return {
              ...child,
              title: child.project_name,
              rawId: child.id,
              id: `${child.id}-folder`,
            };
          }),
          parentProject
        )
      )
    : [];

  const loadingRows = new Array(4).fill(null).map((_) => formatLoading({}));

  const canEdit =
    activeProject?.status === "full_access" ||
    activeProject?.current_user_is_admin;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div
        onDragOver={() => {
          setShowDroppableOverlay(true);
        }}
        // onDragEnter={() => {
        //   setShowDroppableOverlay(true);
        // }}
        onDragLeave={() => {
          setShowDroppableOverlay(false);
        }}
        style={{ width: "100%", height: "100%", position: "relative" }}
        className={css(showDroppableOverlay && styles.onDroppableOverlay)}
      >
        {showDroppableOverlay && (
          <div className={css(styles.droppableOverlay)}>
            <DroppableZone
              accept=".pdf,.bib"
              fullWidth={true}
              handleFileDrop={(acceptedFiles) => {
                handleFileDrop(acceptedFiles);
                setShowDroppableOverlay(false);
              }}
              multiple
              noClick
              id={dropzoneId}
            >
              <div style={{ width: "100%", height: "100%" }}></div>
            </DroppableZone>
          </div>
        )}

        <DataGrid
          apiRef={apiRef}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          rowReordering
          isRowSelectable={(params) =>
            String(params.id).includes("parent") || params.row.is_loading
              ? false
              : true
          }
          columns={columnsFormat}
          sx={DATA_GRID_STYLE_OVERRIDE}
          rows={isLoading ? loadingRows : formattedReferenceRows}
          hideFooter
          ref={tableRef}
          className={
            formattedReferenceRows.length === 0
              ? "empty-data-grid"
              : "full-data-grid"
          }
          localeText={{
            // @ts-ignore MUI has typed this to be string. But elements seem to work
            noRowsLabel: (
              <UploadFileDragAndDrop
                children={""}
                accept={".pdf,.bib"}
                fileTypeString="PDF or BibTeX files"
                handleFileDrop={
                  formattedReferenceRows.length === 0
                    ? handleFileDrop
                    : silentEmptyFnc
                }
              />
            ),
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
                citation_type: false,
              },
            },
          }}
          onRowClick={handleSingleClick}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(ids) => {
            handleRowSelection(ids);
          }}
          slots={{
            row: (row) => {
              const { row: refDataRow } = row;
              const typedRefDataRow = refDataRow as ReferenceTableRowDataType;

              let rowType: "FOLDER" | "BACK-TO-PARENT" | "REFERENCE" =
                "REFERENCE";
              const idAsString = typedRefDataRow!.id!.toString();

              if (idAsString.includes("parent")) {
                rowType = "BACK-TO-PARENT";
              } else if (idAsString.includes("folder")) {
                rowType = "FOLDER";
              }
              if (
                (row.row.id === rowHovered && !row.row.is_loading) ||
                hasTouchCapability
              ) {
                const hoveredRow = referenceTableRowData.find(
                  (item) => item.id === row?.row?.id
                );

                typedRefDataRow.actions = (
                  <div style={{ marginRight: 10 }}>
                    {/* Replace with your actual action buttons */}
                    <Stack direction="row" spacing={0}>
                      {rowType === "REFERENCE" && hoveredRow && (
                        <>
                          {hoveredRow.attachment && !hasTouchCapability && (
                            <Tooltip title="Open" placement="top">
                              <IconButton
                                aria-label="Open"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setReferenceItemDatum(hoveredRow);
                                  openTab(hoveredRow);
                                }}
                                sx={{
                                  padding: 1,
                                  fontSize: "22px",
                                  "&:hover": {
                                    background:
                                      "rgba(25, 118, 210, 0.04) !important",
                                  },
                                }}
                              >
                                <OpenWithOutlinedIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {!hasTouchCapability &&
                            hoveredRow.related_unified_doc && (
                              <Tooltip title="Open Public Page" placement="top">
                                <IconButton
                                  aria-label="Open Public Page"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    // open page in new tab
                                    const url = getUrlToUniDoc(
                                      hoveredRow.related_unified_doc
                                    );
                                    window.open(url, "_blank");
                                  }}
                                  sx={{
                                    padding: 1,
                                    fontSize: "22px",
                                    "&:hover": {
                                      background:
                                        "rgba(25, 118, 210, 0.04) !important",
                                    },
                                  }}
                                >
                                  <img
                                    src="/static/beaker-gray.svg"
                                    width="24px"
                                    height="24px"
                                    alt="ResearchHub Icon"
                                    style={{
                                      transform: "translateY(-2px)",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          {!hasTouchCapability && canEdit && (
                            <Tooltip title="Edit Metadata" placement="top">
                              <IconButton
                                aria-label="Edit Metadata"
                                sx={{
                                  padding: 1,
                                  fontSize: "22px",
                                  "&:hover": {
                                    background:
                                      "rgba(25, 118, 210, 0.04) !important",
                                  },
                                }}
                                onClick={(event) => {
                                  handleMetadataAction({
                                    event,
                                    row: hoveredRow,
                                  });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faInfoCircle}
                                  fontSize={20}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}

                      <ReferenceItemOptsDropdown
                        refId={typedRefDataRow.id}
                        handleDelete={handleDelete}
                        handleMetadataAction={(event) =>
                          handleMetadataAction({ event, row: hoveredRow })
                        }
                        handleOpenPublicPage={(event) => {
                          event.stopPropagation();
                          if (!hoveredRow || !hoveredRow.related_unified_doc) {
                            return;
                          }
                          // open page in new tab
                          const url = getUrlToUniDoc(
                            hoveredRow.related_unified_doc
                          );
                          window.open(url, "_blank");
                        }}
                        hasPublicPage={Boolean(
                          hoveredRow && hoveredRow.related_unified_doc
                        )}
                      />
                    </Stack>
                  </div>
                );
              }
              return (
                <GridRow
                  {...row}
                  draggable={false}
                  style={{
                    background:
                      rowDraggedOver === row.row.id && colors.NEW_BLUE(1),
                    color: rowDraggedOver === row.row.id && "#fff",
                  }}
                  onDragEnter={() =>
                    rowType === "FOLDER" && setRowDraggedOver(row.row.id)
                  }
                  onDragLeave={() =>
                    rowType === "FOLDER" && setRowDraggedOver(null)
                  }
                  onDrag={() => {
                    setRowDragged(row.row.id);
                  }}
                  onDrop={(e) => {
                    rowType === "FOLDER" && rowDropped(row.row);
                  }}
                  onMouseEnter={() => {
                    setRowHovered(row.row.id);
                  }}
                  onMouseLeave={() => setRowHovered(null)}
                />
              );
            },
            cell: (cell) => {
              if (cell.value === "load") {
                return (
                  <div className="data-grid-loader">
                    <GridSkeletonCell {...cell} />
                  </div>
                );
              }

              const projectIdString = cell.rowId.toString();

              if (projectIdString.includes("folder")) {
                const projectId = projectIdString.split("-folder")[0];
                return (
                  <div style={{ cursor: "pointer" }}>
                    <GridCell {...cell} />
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <GridCell {...cell} />
                  </div>
                );
              }
            },
          }}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  droppableOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
  onDroppableOverlay: {
    backgroundColor: "#F7F7FB",
  },
});
