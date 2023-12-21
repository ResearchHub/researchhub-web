import { breakpoints } from "~/config/themes/screen";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

export const styles = StyleSheet.create({
  viewAll: {
    marginLeft: "auto",
    color: colors.NEW_BLUE(0.9),
    textDecoration: "none",
    textTransform: "initial",
    fontSize: 14,
    letterSpacing: "normal",
    ":hover": {
      opacity: 0.5,
    },
  },
  RSC: {
    height: 20,
  },
  HomeRightSidebar: {
    borderLeft: `1.5px solid ${colors.LIGHT_GREY_BORDER}`,
    boxSizing: "border-box",
    height: "100%",
    maxWidth: 320,
    position: "relative",
    width: "100%",
    background: "white",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "none",
    },
  },
  HomeRightSidebarContainer: {
    borderRadius: 4,
    color: colors.GREY_LIST_LABEL,
    padding: "0 0 16px 0",
    // position: "sticky",
    top: NAVBAR_HEIGHT + 15,
    boxShadow: "none",
  },
  RightSidebarTitle: {
    background: colors.WHITE,
    padding: "22px 20px 10px 20px",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      padding: "15px 0 5px",
    },
  },
});
