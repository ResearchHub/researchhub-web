import { columns, rows } from "./table_mock_data";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useReferenceTabContext } from "./context/ReferencesTabContext";
import { idID } from "@mui/material/locale";

export default function ReferencesTable() {
  const [pageSize, setPageSize] = useState(10);
  const { setIsTabOpen, setReferenceItemData } = useReferenceTabContext();

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        checkboxSelection
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        sx={{
          border: "1px solid #E9EAEF",

          "& .MuiDataGrid-columnHeaders": {
            // border: "1px solid #E9EAEF",
            background: "#FAFAFC",
          },

          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },

          "& .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
          },

          "& .MuiTablePagination-toolbar": {
            left: "-80px",
          },

          "& .MuiTablePagination-root": {
            width: "100%",
          },

          "& .MuiTablePagination-actions": {
            display: "flex",
          },

          "& .MuiIconButton-root:hover": {
            background: "none",
          },

          "& .MuiDataGrid-columnHeader": {
            borderLeft: "1px solid #E9EAEF",
          },

          "& .MuiDataGrid-columnHeader:first-child": {
            borderLeft: 0,
          },

          "& .MuiDataGrid-columnHeader:nth-child(2)": {
            borderLeft: 0,
          },

          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
        rows={rows}
        pageSize={pageSize}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight={true}
        onCellClick={(params, event, _details): void => {
          event.stopPropagation();
          setReferenceItemData({
            ...rows.find((item) => item.id === params?.row?.id),
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
