import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

export const styles = StyleSheet.create({
  RhHomeRightSidebar: {
    height: "100%",
    width: "100%",
  },
  RhHomeRightSidebarContainer: {
    border: "1.5px solid #F0F0F0",
    borderRadius: 4,
    color: colors.GREY_LIST_LABEL,
  },
  RightSidebarTitle: {
    background: "#FFF",
    padding: "15px 20px 10px 20px",
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      padding: "15px 0 5px",
    },
  },
});
