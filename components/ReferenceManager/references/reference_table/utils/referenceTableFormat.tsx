import { GridColDef } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp, faFolder } from "@fortawesome/pro-solid-svg-icons";

export const columnsFormat: GridColDef[] = [
  { field: "id", headerName: "", width: 0 },
  {
    field: "title",
    headerName: "Title",
    width: 300,
    renderCell: (cell) => {
      const idString = cell.row.id.toString();
      if (idString.includes("folder") && cell.value) {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <FontAwesomeIcon
              icon={idString.includes("parent") ? faArrowTurnUp : faFolder}
              style={{ marginRight: 8 }}
              color={idString.includes("parent") ? "#7C7989" : "#7BD3F9"}
            />
            {cell.value}
          </div>
        );
      }
    },
  },
  { field: "authors", headerName: "Authors", sortable: false, width: 250 },
  { field: "last_author", headerName: "Last Author", width: 200 },
  // {
  //   field: "hubs",
  //   headerName: "Hubs",
  //   description: "This is Hub Column",
  //   sortable: false,
  //   width: 240,
  //   // TODO: calvinhlee - investigate what this is
  //   // valueGetter: (params: GridValueGetterParams) =>
  //   //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
  {
    field: "published_date",
    headerName: "Publication Date",
    type: "string",
    width: 140,
  },
  {
    field: "added_date",
    headerName: "Added Date",
    type: "string",
    width: 140,
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    headerAlign: "right",
    width: 150,
    align: "right",
    renderCell: (cell) => {
      return cell.row.actions;
    },
  },
];
