import { columns, rows } from "./table_mock_data";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useReferenceTabContext } from "./context/ReferencesTabContext";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { fetchCurrentUserReferenceCitations } from "./api/fetchCurrentUserReferenceCitations";
import { DATA_GRID_STYLE_OVERRIDE } from "./styles/ReferencesTableStyles";
import { formatReferenceItemData } from "./utils/formatReferenceItemData";

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
  const { referenceItemData, setIsTabOpen, setReferenceItemData } =
    useReferenceTabContext();

  useEffectFetchReferenceCitations({
    onSuccess: (payload: any) => {
      debugger
      setReferenceItemData(payload?.results);
      setIsReady(true);
    },
    onError: emptyFncWithMsg,
  });

  const formattedReferenceItemDataRows = isReady
    ? nullthrows(formatReferenceItemData(referenceItemData))
    : [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={!isReady}
        checkboxSelection
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        sx={DATA_GRID_STYLE_OVERRIDE}
        rows={formattedReferenceItemDataRows}
        pageSize={pageSize}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight={true}
        onCellClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItemData({
            ...nullthrows(rows.find((item) => item.id === params?.row?.id)),
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
