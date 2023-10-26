import { styled } from "@mui/material/styles";
import MuiPagination from "@mui/material/Pagination";
import colors from "~/config/themes/colors";

const Pagination = styled(MuiPagination)(({ theme }) => ({
  "& .MuiPaginationItem-outlined": {
    borderColor: colors.GREY(0.4),
  },
  "& .MuiPaginationItem-outlined.Mui-selected": {
    backgroundColor: colors.NEW_BLUE(0.1),
    color: colors.NEW_BLUE(),
    borderColor: colors.NEW_BLUE(0.6),
  },
  "& .MuiPaginationItem-outlined.Mui-selected:hover, & .MuiPaginationItem-outlined.Mui-selected.Mui-focusVisible":
    {
      backgroundColor: colors.NEW_BLUE(0.2),
      color: colors.NEW_BLUE(),
      borderColor: colors.NEW_BLUE(0.6),
    },
}));

export default Pagination;
