import { StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
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
  HomeRightSidebar: {
    borderLeft: `1.5px solid ${colors.LIGHT_GREY_BORDER}`,
    height: "100%",
    position: "relative",
    width: "100%",
    maxWidth: 320,
    // TODO: calvinhlee - add media query width
  },
  HomeRightSidebarContainer: {
    borderRadius: 4,
    borderTop: "none",
    color: colors.GREY_LIST_LABEL,
    position: "sticky",
    top: NAVBAR_HEIGHT,
  },
  RightSidebarTitle: {
    background: colors.WHITE,
    padding: "15px 20px 10px 20px",
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      padding: "15px 0 5px",
    },
  },
});