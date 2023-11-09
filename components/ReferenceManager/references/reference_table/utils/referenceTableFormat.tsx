import { GridColDef } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp, faFolder } from "@fortawesome/pro-solid-svg-icons";
import {
  faFileExclamation,
  faFileLines,
} from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";
import colors from "~/config/themes/colors";

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "pre",
              overflow: "auto",
            }}
          >
            <FontAwesomeIcon
              icon={idString.includes("parent") ? faArrowTurnUp : faFolder}
              style={{ marginRight: 13, fontSize: 16, width: 16 }}
              color={idString.includes("parent") ? "#7C7989" : "#AAA8B4"}
            />
            {cell.value}
          </div>
        );
      } else if (cell.row?.attachment || cell.row?.raw_data?.attachment) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "pre",
              overflow: "auto",
            }}
          >
            <FontAwesomeIcon
              icon={faFileLines}
              style={{ marginRight: 13, fontSize: 19, width: 16 }}
              color={idString.includes("parent") ? "#7C7989" : "#AAA8B4"}
            />
            {cell.value}
          </div>
        );
      } else {
        // doesn't have an attachment
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "pre",
              overflow: "auto",
            }}
          >
            <FontAwesomeIcon
              icon={faFileExclamation}
              style={{ marginRight: 13, fontSize: 19, width: 16 }}
              color={colors.ORANGE()}
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
    field: "issued",
    headerName: "Publication Date",
    width: 140,
    renderCell: (cell) => {
      if (cell.row.published_date) {
        return <div>{dayjs(cell.row.published_date).format("M-D-YYYY")}</div>;
      }
      return <div>{cell.value}</div>;
    },
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
    minWidth: 150,
    headerAlign: "right",
    width: 150,
    align: "right",
    renderCell: (cell) => {
      return <div style={{ textAlign: "right" }}>{cell.row.actions}</div>;
    },
  },
];
