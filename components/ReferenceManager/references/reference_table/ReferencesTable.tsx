import { columnsFormat } from "./utils/referenceTableFormat";
import { DATA_GRID_STYLE_OVERRIDE } from "../styles/ReferencesTableStyles";
import { DataGrid, GridCell, GridSkeletonCell } from "@mui/x-data-grid";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchCurrentUserReferenceCitations } from "../api/fetchCurrentUserReferenceCitations";
import {
  formatReferenceRowData,
  ReferenceTableRowDataType,
} from "./utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { useEffect, useState } from "react";
import { useReferenceTabContext } from "../reference_item/context/ReferenceItemDrawerContext";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useRouter } from "next/router";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";

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

export default function ReferencesTable({
  createdReferences,
  handleFileDrop,
  setSelectedReferenceIDs,
}: Props) {
  const { setIsDrawerOpen, setReferenceItemDrawerData, referencesFetchTime } =
    useReferenceTabContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [referenceTableRowData, setReferenceTableRowData] = useState<
    ReferenceTableRowDataType[]
  >([]);

  useEffectFetchReferenceCitations({
    setIsLoading,
    onSuccess: (payload: any) => {
      setReferenceTableRowData(payload?.results);
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

  const formattedReferenceRows = !isLoading
    ? nullthrows(formatReferenceRowData(referenceTableRowData))
    : [];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
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
          setReferenceItemDrawerData({
            ...nullthrows(
              referenceTableRowData.find((item) => item.id === params?.row?.id)
            ),
          });
          if (params.field !== "__check__") {
            setIsDrawerOpen(true);
          }
        }}
        onRowSelectionModelChange={(selectedReferenceIDs) => {
          setSelectedReferenceIDs(selectedReferenceIDs);
        }}
        slots={{
          cell: (cell) => {
            if (cell.value === "load") {
              return (
                <div className="data-grid-loader">
                  <GridSkeletonCell {...cell} />
                </div>
              );
            }
            return <GridCell {...cell} />;
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
    </div>
  );
}
