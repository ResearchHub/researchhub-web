import { columnsFormat } from "./utils/referenceTableFormat";
import { DATA_GRID_STYLE_OVERRIDE } from "../styles/ReferencesTableStyles";
import {
  DataGrid,
  GridCell,
  GridRow,
  GridSkeletonCell,
  useGridApiContext,
  useGridApiEventHandler,
  useGridApiRef,
} from "@mui/x-data-grid";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchCurrentUserReferenceCitations } from "../api/fetchCurrentUserReferenceCitations";
import { formatReferenceRowData } from "./utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { useEffect, useRef, useState } from "react";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useRouter } from "next/router";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";
import { useReferencesTableContext } from "./context/ReferencesTableContext";
import PDFViewer from "~/components/Document/lib/PDFViewer/PDFViewer";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";
import Link from "next/link";
import { updateReferenceCitation } from "../api/updateReferenceCitation";
import colors from "~/config/themes/colors";

type Props = {
  createdReferences: any[];
  handleFileDrop: () => void;
  setSelectedReferenceIDs: (refs: any[]) => void;
};

type Props = {
  createdReferences: any[];
  handleFileDrop: () => void;
  setSelectedReferenceIDs: (refs: any[]) => void;
};

function useEffectFetchReferenceCitations({
  onError,
  onSuccess,
  referencesFetchTime,
  setIsLoading,
}) {
  // NOTE: current we are assuming that citations only belong to users. In the future it may belong to orgs
  const user = getCurrentUser();

  const { currentOrg } = useOrgs();
  const router = useRouter();
  useEffect(() => {
    if (!isNullOrUndefined(user?.id) && currentOrg?.id) {
      setIsLoading(true);
      fetchCurrentUserReferenceCitations({
        onSuccess,
        onError,
        organizationID: currentOrg?.id,
        // @ts-ignore
        projectID: router.query?.project,
        getCurrentUserCitation: isEmpty(router.query?.org_refs),
      });
    }
  }, [
    fetchCurrentUserReferenceCitations,
    user?.id,
    referencesFetchTime,
    currentOrg,
    router.query,
  ]);
}

// TODO: @lightninglu10 - ReferenceTableRowDataType became worthless after updating this component. We need to address this
export default function ReferencesTable({
  createdReferences,
  handleFileDrop,
  setSelectedReferenceIDs,
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

  const router = useRouter();
  const apiRef = useGridApiRef();

  const moveCitationToFolder = ({ moveToProjectId }) => {
    const newReferenceData = referenceTableRowData.filter((data) => {
      return data.id !== rowDragged;
    });
    setReferenceTableRowData(newReferenceData);
    updateReferenceCitation({
      payload: {
        citation_id: rowDragged,
        // TODO: calvinhlee - create utily functions to format these
        project: parseInt(moveToProjectId, 10),
      },
      onSuccess: () => {
        setRowDraggedOver();
      },
      onError: () => {},
    });
  };

  const rowDropped = (params) => {
    setDragStarted(false);

    const stringId = params.id.toString();
    if (stringId.includes("folder")) {
      moveCitationToFolder({
        moveToProjectId: stringId.split("-folder")[0],
      });
    }
  };

  const { activeProject, setActiveProject } =
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
        loading={isLoading}
        onCellDoubleClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItemDatum({
            ...nullthrows(
              referenceTableRowData.find((item) => item.id === params?.row?.id)
            ),
          });
          setPDFIsOpen(true);
          setPdfUrl(params.row.raw_data.attachment);
          // console.log(params);
          // if (params.field !== "__check__") {
          //   setIsDrawerOpen(true);
          // }
        }}
        rowReordering
        // onRowClick={(params) => {
        //   console.log(params);
        //   const projectIdString = params.id.toString();

        //   if (projectIdString.includes("folder")) {
        //     const projectId = projectIdString.split("-folder")[0];
        //     router.push(
        //       `/reference-manager/${router.query.organization}?project=${projectId}`
        //     );
        //   }
        // }}
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

              const url = `/reference-manager/${router.query.organization}?project=${projectId}&root_project=${router.query.root_project}`;

              if (event.metaKey) {
                window.open(url, "_blank");
              } else {
                router.push(url);
              }
            } else {
              setIsDrawerOpen(true);
            }
          } else {
            setSelectedReferenceIDs(params.id);
          }
        }}
        onRowSelectionModelChange={(selectedReferenceIDs) => {
          setSelectedReferenceIDs(selectedReferenceIDs);
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
                  if (!folderRow) {
                    setDragStarted(true);
                    setRowDragged(row.row.id);
                  }
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
