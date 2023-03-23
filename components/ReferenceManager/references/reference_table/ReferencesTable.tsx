import { columnsFormat } from "../utils/referenceTableFormat";
import { DATA_GRID_STYLE_OVERRIDE } from "../styles/ReferencesTableStyles";
import { DataGrid } from "@mui/x-data-grid";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchCurrentUserReferenceCitations } from "../api/fetchCurrentUserReferenceCitations";
import {
  formatReferenceRowData,
  ReferenceTableRowDataType,
} from "../utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { useEffect, useState } from "react";
import { useReferenceTabContext } from "../context/ReferenceItemDrawerContext";

function useEffectFetchReferenceCitations({
  onSuccess,
  onError,
  setIsLoading,
}) {
  // NOTE: current we are assuming that citations only belong to users. In the future it may belong to orgs
  const user = getCurrentUser();
  useEffect(() => {
    if (!isNullOrUndefined(user?.id)) {
      setIsLoading(true);
      fetchCurrentUserReferenceCitations({ onSuccess, onError });
    }
  }, [fetchCurrentUserReferenceCitations, user?.id]);
}

export default function ReferencesTable() {
  const { setIsDrawerOpen, setReferenceItemDrawerData } =
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
  });

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
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              citation_type: false,
            },
          },
        }}
        loading={isLoading}
        onCellClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItemDrawerData({
            ...nullthrows(
              referenceTableRowData.find((item) => item.id === params?.row?.id)
            ),
          });
          setIsDrawerOpen(true);
        }}
        // onRowClick={(params, event, details) => {
        //   event.stopPropagation();
        // }}
        sx={DATA_GRID_STYLE_OVERRIDE}
        rows={formattedReferenceRows}
      />
      <div
        style={{
          width: "100%",
          background: "pink",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {"Infinite pagination!!!!!"}
      </div>
    </div>
  );
}
