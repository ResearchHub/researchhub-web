export const DATA_GRID_STYLE_OVERRIDE = {
  // "@media (max-width: 768px)": {
  // ".MuiDataGrid-root": {
  // ".MuiDataGrid-windowContainer": {
  //   display: "block"
  // },
  // ".MuiDataGrid-row": {
  //   display: "block",
  //   marginBottom: "1rem",
  //   boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  // },
  // ".MuiDataGrid-cell": {
  //   display: "block",
  //   width: "100%",
  //   boxSizing: "border-box",
  //   padding: "0.5rem 1rem",
  //   borderBottom: "1px solid #e0e0e0",
  //   "&:last-child": {
  //     borderBottom: "none"
  //   }
  // },
  // },
  // },

  "& .MuiDataGrid-row": {
    cursor: "pointer",
  },

  // Hide checkbox for disabled rows
  ".Mui-disabled.MuiDataGrid-checkboxInput": {
    display: "none",
  },

  border: "1px solid #E9EAEF",
  // minHeight: "300px",
  "&	.MuiDataGrid-overlayWrapper": {
    zIndex: 2,
  },
  "& .MuiDataGrid-columnHeaders": {
    // border: "1px solid #E9EAEF",
    background: "#FAFAFC",
  },

  "& .MuiDataGrid-cell": {
    outline: "none !important",
  },

  ".empty-data-grid& .MuiDataGrid-virtualScroller": {
    minHeight: "200px",
  },

  ".empty-data-grid& .MuiDataGrid-overlayWrapperInner": {
    minHeight: "200px",
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
};
