import colors from "~/config/themes/colors";

export const DATA_GRID_STYLE_OVERRIDE = {
  border: `1px solid ${colors.LIGHT_GREYISH_BLUE5()}`,
  // minHeight: "300px",
  "&	.MuiDataGrid-overlayWrapper": {
    zIndex: 2,
  },
  "& .MuiDataGrid-columnHeaders": {
    // border: `1px solid ${colors.LIGHT_GREYISH_BLUE5()}`,
    background: colors.LIGHT_GRAY_BACKGROUND2(),
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
    borderLeft: `1px solid ${colors.LIGHT_GREYISH_BLUE5()}`,
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
