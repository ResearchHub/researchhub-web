import { useEffect, useState } from "react";
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
import { formatReferenceRowData } from "./utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import {
  isNullOrUndefined,
  nullthrows,
  emptyFncWithMsg,
  isEmpty,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { DATA_GRID_STYLE_OVERRIDE } from "../styles/ReferencesTableStyles";
import { fetchReferenceOrgProjects } from "../reference_organizer/api/fetchReferenceOrgProjects";
import { updateReferenceCitation } from "../api/updateReferenceCitation";
import { upsertReferenceProject } from "../reference_organizer/api/upsertReferenceProject";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";
import { useReferencesTableContext } from "./context/ReferencesTableContext";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import colors from "~/config/themes/colors";
import PDFViewer from "~/components/Document/lib/PDFViewer/PDFViewer";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";

type Props = {
  createdReferences: any[];
  handleFileDrop: any[];
  setSelectedReferenceIDs: (refs: any[]) => void;
  setSelectedFolderIds: (refs: any[]) => void;
};

export type PreloadRow = {
  citation_type: string;
  id: string;
  created: boolean;
};

function useEffectFetchReferenceCitations({
  onError,
  onSuccess,
  referencesFetchTime,
  setIsLoading,
}) {
  // NOTE: current we are assuming that citations only belong to users. In the future it may belong to orgs
  const user = getCurrentUser();
  const { activeProject, isFetchingProjects } =
    useReferenceActiveProjectContext();

  const { currentOrg } = useOrgs();
  const router = useRouter();
  useEffect(() => {
    if (!isNullOrUndefined(user?.id) && currentOrg?.id && !isFetchingProjects) {
      setIsLoading(true);
      fetchCurrentUserReferenceCitations({
        onSuccess,
        onError,
        organizationID: currentOrg?.id,
        // @ts-ignore
        projectID: activeProject.projectID,
        getCurrentUserCitation: isEmpty(router.query?.org_refs),
      });
    }
  }, [
    fetchCurrentUserReferenceCitations,
    user?.id,
    referencesFetchTime,
    currentOrg,
    activeProject?.projectID,
    isFetchingProjects,
    router.query.org_refs,
  ]);
}

// TODO: @lightninglu10 - ReferenceTableRowDataType became worthless after updating this component. We need to address this
export default function ReferencesTable({
  createdReferences,
  handleFileDrop,
  setSelectedReferenceIDs,
  setSelectedFolderIds,
}: Props) {
  const { setIsDrawerOpen, setReferenceItemDatum, referencesFetchTime } =
    useReferenceTabContext();
  const { referenceTableRowData, setReferenceTableRowData } =
    useReferencesTableContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pdfIsOpen, setPDFIsOpen] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [dragStarted, setDragStarted] = useState(false);
  const [rowDraggedOver, setRowDraggedOver] = useState();
  const [rowDragged, setRowDragged] = useState();
  const { currentOrg } = useOrgs();

  const router = useRouter();
  const apiRef = useGridApiRef();

  const moveCitationToFolder = ({ moveToFolderId }) => {
    const newReferenceData = referenceTableRowData.filter((data) => {
      return data.id !== rowDragged;
    });
    setReferenceTableRowData(newReferenceData);
    updateReferenceCitation({
      payload: {
        citation_id: rowDragged,
        // TODO: calvinhlee - create utily functions to format these
        project: parseInt(moveToFolderId, 10),
      },
      onSuccess: () => {
        setRowDraggedOver();
      },
      onError: () => {},
    });
  };

  const moveFolderToFolder = ({ moveToFolderId }) => {
    const intId = parseInt(rowDragged?.split("-folder")[0], 10);
    const newChildren = activeProject?.children.filter((data) => {
      return data.id !== intId;
    });
    const newActiveProject = { ...activeProject };
    newActiveProject.children = newChildren;
    debugger;
    setActiveProject(newActiveProject);

    upsertReferenceProject({
      upsertPurpose: "update",
      onSuccess: () => {
        fetchReferenceOrgProjects({
          onSuccess: (payload) => {
            setCurrentOrgProjects(payload);
          },
          payload: {
            organization: currentOrg.id,
          },
        });
      },
      payload: {
        project: intId,
        parent: parseInt(moveToFolderId, 10),
      },
    });
  };

  const rowDropped = (params) => {
    setDragStarted(false);

    const stringId = params.id.toString();
    if (stringId.includes("folder")) {
      const moveToFolderId = stringId.split("-folder")[0];
      if (rowDragged?.toString().includes("folder")) {
        moveFolderToFolder({ moveToFolderId });
      } else {
        moveCitationToFolder({
          moveToFolderId,
        });
      }
    }
  };

  const {
    activeProject,
    setActiveProject,
    setCurrentOrgProjects,
    isFetchingProjects,
  } = useReferenceActiveProjectContext();

  useEffectFetchReferenceCitations({
    setIsLoading,
    onSuccess: (payload: any) => {
      setReferenceTableRowData(payload);
      setIsLoading(false);
    },
    onError: emptyFncWithMsg,
    referencesFetchTime,
  });

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
        id: `${activeProject?.parent_data?.id}-folder-parent`,
      }
    : null;

  const formattedReferenceRows = !isLoading
    ? nullthrows(
        formatReferenceRowData(
          referenceTableRowData,
          // NOTE: calvinhlee - Please check type here @lightninglu10. same here.
          activeProject?.children?.map((child) => {
            return {
              ...child,
              title: child.project_name,
              id: `${child.id}-folder`,
            };
          }),
          parentProject
        )
      )
    : [];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        apiRef={apiRef}
        autoHeight
        disableRowSelectionOnClick
        checkboxSelection
        columns={columnsFormat}
        hideFooter
        className={formattedReferenceRows.length === 0 ? "empty-data-grid" : ""}
        localeText={{
          // @ts-ignore MUI has typed this to be string. But elements seem to work
          noRowsLabel: (
            <UploadFileDragAndDrop
              children={""}
              accept={".pdf"}
              handleFileDrop={handleFileDrop}
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
        loading={isLoading || isFetchingProjects}
        onCellDoubleClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItemDatum({
            ...nullthrows(
              referenceTableRowData.find((item) => item.id === params?.row?.id)
            ),
          });
          setPDFIsOpen(true);
          setPdfUrl(params.row.raw_data.attachment);
        }}
        rowReordering
        onCellClick={(params, event, _details): void => {
          if (params.field !== "__check__") {
            setReferenceItemDatum({
              ...nullthrows(
                referenceTableRowData.find(
                  (item) => item.id === params?.row?.id
                )
              ),
            });

            const projectIdString = params.id.toString();

            if (projectIdString.includes("folder")) {
              const projectId = projectIdString.split("-folder")[0];

              let url = `/reference-manager/${
                router.query.organization
              }/${router.query.slug.join("/")}/${params.row.title}`;

              if (projectIdString.includes("parent")) {
                url = `/reference-manager/${
                  router.query.organization
                }/${router.query.slug
                  ?.slice(0, router.query.slug.length - 2)
                  .join("/")}/${params.row.title}`;
              }

              if (event.metaKey) {
                window.open(url, "_blank");
              } else {
                router.push(url);
              }
            } else {
              setIsDrawerOpen(true);
            }
          }
        }}
        onRowSelectionModelChange={(selectedReferenceIDs) => {
          const folderIds: GridRowId[] = [];
          const referenceIds: GridRowId[] = [];
          selectedReferenceIDs.forEach((referenceId) => {
            const projectIdString = referenceId.toString();
            if (projectIdString.includes("folder")) {
              folderIds.push(referenceId);
            } else {
              referenceIds.push(referenceId);
            }
          });
          setSelectedFolderIds(folderIds);
          setSelectedReferenceIDs(referenceIds);
        }}
        slots={{
          row: (row) => {
            let folderRow = false;
            const stringId = row.row.id.toString();
            if (stringId.includes("folder")) {
              folderRow = true;
            }
            return (
              <GridRow
                {...row}
                draggable={true}
                style={{
                  background:
                    rowDraggedOver === row.row.id && colors.NEW_BLUE(1),
                  color: rowDraggedOver === row.row.id && "#fff",
                }}
                onDragEnter={() => folderRow && setRowDraggedOver(row.row.id)}
                onDragLeave={() => folderRow && setRowDraggedOver()}
                onDrag={() => {
                  setDragStarted(true);
                  setRowDragged(row.row.id);
                }}
                onDrop={() => folderRow && rowDropped(row.row)}
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
                  <GridCell {...cell} onClick={(e) => e.stopPropagation()} />
                </div>
              );
            }
          },
        }}
        sx={DATA_GRID_STYLE_OVERRIDE}
        rows={formattedReferenceRows}
      />
      {/* <div
        style={{
          width: "100%",
          background: "pink",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {"Infinite pagination!!!!!"}
      </div> */}
      {pdfIsOpen && (
        <PDFViewer
          pdfUrl={pdfUrl}
          expanded={true}
          pdfClose={() => {
            setPDFIsOpen(false);
            setPdfUrl("");
          }}
          onZoom={(zoom) => {
            // setViewerWidth(zoom.newWidth);
          }}
        />
      )}
    </div>
  );
}
