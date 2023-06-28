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

// Utils
import { columnsFormat } from "./utils/referenceTableFormat";
import { fetchCurrentUserReferenceCitations } from "../api/fetchCurrentUserReferenceCitations";
import { formatReferenceRowData } from "./utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import {
  isNullOrUndefined,
  nullthrows,
  emptyFncWithMsg,
  isEmpty,
} from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import { updateReferenceCitation } from "../api/updateReferenceCitation";
import { upsertReferenceProject } from "../reference_organizer/api/upsertReferenceProject";
import { fetchReferenceOrgProjects } from "../reference_organizer/api/fetchReferenceOrgProjects";

// Effects
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferencesTableContext } from "./context/ReferencesTableContext";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";

// Styles
import { DATA_GRID_STYLE_OVERRIDE } from "../styles/ReferencesTableStyles";

// Components
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";
import PDFViewer from "~/components/Document/lib/PDFViewer/PDFViewer";

type Props = {
  createdReferences: any[];
  handleFileDrop: () => void;
  setSelectedReferenceIDs: (refs: any[]) => void;
  setSelectedFolderIds: (refs: any[]) => void;
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
  const {
    referenceTableRowData,
    setReferenceTableRowData,
    rowDraggedOver,
    setRowDraggedOver,
    setRowDragged,
    rowDropped,
  } = useReferencesTableContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pdfIsOpen, setPDFIsOpen] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const router = useRouter();
  const apiRef = useGridApiRef();

  const { activeProject, isFetchingProjects } =
    useReferenceActiveProjectContext();

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

  const parentProject = activeProject.parent_data
    ? {
        ...activeProject.parent_data,
        parentFolder: true,
        title: activeProject.parent_data.project_name,
        rawId: activeProject.parent_data.id,
        id: `${activeProject.parent_data.id}-folder-parent`,
      }
    : null;

  const formattedReferenceRows = !isLoading
    ? nullthrows(
        formatReferenceRowData(
          referenceTableRowData,
          activeProject.children?.map((child) => {
            return {
              ...child,
              title: child.project_name,
              id: `${child.id}-folder`,
              rawId: child.id,
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
          noRowsLabel: (
            <UploadFileDragAndDrop
              handleFileDrop={handleFileDrop}
              accept={".pdf"}
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
                  setRowDragged(row.row.id);
                }}
                onDrop={() => {
                  console.log(row.row);
                  folderRow && rowDropped({ id: row.row.rawId });
                }}
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
