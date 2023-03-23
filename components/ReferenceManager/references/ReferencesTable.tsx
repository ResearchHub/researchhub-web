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

function useEffectFetchReferenceCitations({ onSuccess, onError }) {
  // NOTE: current we are assuming that citations only belong to users. In the future it may belong to orgs
  const user = getCurrentUser();
  useEffect(() => {
    if (!isNullOrUndefined(user?.id)) {
      fetchCurrentUserReferenceCitations({ onSuccess, onError });
    }
  }, [fetchCurrentUserReferenceCitations, user?.id]);
}

export default function ReferencesTable() {
  const [pageSize, setPageSize] = useState(10);
  const [isReady, setIsReady] = useState<boolean>(false);
  const {
    referenceRowData,
    setIsTabOpen,
    setReferenceRowData,
    setReferenceItemTabData,
  } = useReferenceTabContext();

  useEffectFetchReferenceCitations({
    onSuccess: (payload: any) => {
      setReferenceRowData(payload?.results);
      setIsReady(true);
    },
    onError: emptyFncWithMsg,
  });

  const formattedReferenceRows = isReady
    ? nullthrows(formatReferenceRowData(referenceRowData))
    : [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={!isReady}
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
        pageSize={pageSize}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight={true}
        onCellClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItemTabData({
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
