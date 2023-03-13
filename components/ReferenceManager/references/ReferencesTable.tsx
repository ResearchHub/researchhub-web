import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const columns: GridColDef[] = [
  { field: "id", headerName: "", width: 0 },
  { field: "title", headerName: "Title", width: 380 },
  { field: "authors", headerName: "Authors", width: 280 },
  { field: "last_author", headerName: "Last Author", width: 240 },
  {
    field: "hubs",
    headerName: "Hubs",
    description: "This is Hub Column",
    sortable: false,
    width: 220,
    // TODO: calvinhlee - investigate what this is
    // valueGetter: (params: GridValueGetterParams) =>
    //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "published_date",
    headerName: "Publication Date",
    type: "string",
    width: 200,
  },
  {
    field: "published_year",
    headerName: "Publication Year",
    type: "string",
    width: 200,
  },
];

const rows = [
  {
    id: 0,
    authors: "Patrick Matalla et al.",
    hubs: "Optics",
    last_author: "Christian Koos",
    published_date: "Oct 13, 2023",
    published_year: 2023,
    title: "Visual Prompting via Imagie Inpaining",
  },
  {
    id: 1,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
  {
    id: 2,
    authors: "Thomas Clarke et al.",
    hubs: "Medicine",
    last_author: "Johnathan Whetstine",
    published_date: "July 8, 2022",
    published_year: 2022,
    title: "Histon Lysine Methylation Dynamics Control",
  },
  {
    id: 3,
    authors: "Thierry Zami et al.",
    hubs: "Computer Science",
    last_author: " Bruno Lavigne",
    published_date: "May 7, 2013",
    published_year: 2013,
    title: "Impact of Crosstalk on 800 Gb/s",
  },
  {
    id: 4,
    authors: "Patrick Matalla et al.",
    hubs: "Optics",
    last_author: "Christian Koos",
    published_date: "Oct 13, 2023",
    published_year: 2023,
    title: "Visual Prompting via Imagie Inpaining",
  },
  {
    id: 5,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
  {
    id: 9,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
  {
    id: 10,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
  {
    id: 6,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
  {
    id: 7,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
  {
    id: 8,
    authors: "Ingrid Bretherton et al.",
    hubs: "Computer Engineering",
    last_author: "Ada Cheung",
    published_date: "Jan 11, 2021",
    published_year: 2021,
    title: "Hardware Compairson of Feed-Forward Clock Recovery",
  },
];

export default function ReferencesTable() {
  const [pageSize, setPageSize] = useState(10);

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
      />
    </div>
  );
}
