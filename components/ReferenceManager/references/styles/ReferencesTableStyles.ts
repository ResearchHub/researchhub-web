export const DATA_GRID_STYLE_OVERRIDE = {
  "& .MuiDataGrid-row": {
    cursor: "pointer",
    "&:hover .MuiCheckbox-root": {
      color: "#7C7989",
    },
  },

  "& .MuiDataGrid-columnHeaderTitleContainerContent .MuiDataGrid-checkboxInput":
    {
      color: "#7C7989",
    },

  ".MuiDataGrid-checkboxInput.Mui-checked": {
    color: "#7C7989",
  },

  // Hide checkbox for disabled rows
  ".Mui-disabled.MuiDataGrid-checkboxInput": {
    display: "none",
  },

  "& .MuiCheckbox-root": {
    color: "#E9EAEF",
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
