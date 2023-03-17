import { GridColDef } from "@mui/x-data-grid";
import { ReferenceItemDataType } from "./context/ReferencesTabContext";

export const columns: GridColDef[] = [
  { field: "id", headerName: "", width: 0 },
  { field: "title", headerName: "Title", width: 320 },
  { field: "authors", headerName: "Authors", width: 280 },
  { field: "last_author", headerName: "Last Author", width: 140 },
  {
    field: "hubs",
    headerName: "Hubs",
    description: "This is Hub Column",
    sortable: false,
    width: 240,
    // TODO: calvinhlee - investigate what this is
    // valueGetter: (params: GridValueGetterParams) =>
    //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "published_date",
    headerName: "Publication Date",
    type: "string",
    width: 180,
  },
  {
    field: "published_year",
    headerName: "Publication Year",
    type: "string",
    width: 120,
  },
];
