import { columnsFormat } from "./utils/referenceTableFormat";
import { DATA_GRID_STYLE_OVERRIDE } from "./styles/ReferencesTableStyles";
import { DataGrid } from "@mui/x-data-grid";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchCurrentUserReferenceCitations } from "./api/fetchCurrentUserReferenceCitations";
import { formatReferenceRowData } from "./utils/formatReferenceRowData";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { useEffect, useState } from "react";
import { useReferenceTabContext } from "./context/ReferencesTabContext";

function useEffectFetchReferenceCitations({ onSuccess, onError, isLoading }) {
  // NOTE: current we are assuming that citations only belong to users. In the future it may belong to orgs
  const user = getCurrentUser();
  useEffect(() => {
    if (!isNullOrUndefined(user?.id)) {
      isLoading(true);
      fetchCurrentUserReferenceCitations({ onSuccess, onError });
    }
  }, [fetchCurrentUserReferenceCitations, user?.id]);
}

export default function ReferencesTable() {
  const [isLoading, setisLoading] = useState<boolean>(true);
  const {
    referenceTableRowData,
    setIsTabOpen,
    setReferenceTableRowData,
    setReferenceItem,
  } = useReferenceTabContext();

  useEffectFetchReferenceCitations({
    isLoading,
    onSuccess: (payload: any) => {
      setReferenceTableRowData(payload?.results);
      setisLoading(false);
    },
    onError: emptyFncWithMsg,
  });

  const formattedReferenceRows = isLoading
    ? nullthrows(formatReferenceRowData(referenceTableRowData))
    : [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={!isLoading}
        checkboxSelection
        columns={columnsFormat}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              citation_type: false,
            },
          },
        }}
        sx={DATA_GRID_STYLE_OVERRIDE}
        rows={formattedReferenceRows}
        autoHeight={true}
        onCellClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItem({
            ...nullthrows(
              formattedReferenceRows.find((item) => item.id === params?.row?.id)
            ),
          });
          setIsTabOpen(true);
        }}
        // onRowClick={(params, event, details) => {
        //   event.stopPropagation();
        // }}
      />
    </div>
  );
}
