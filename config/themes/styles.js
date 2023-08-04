import { StyleSheet } from "aphrodite";
import colors from "./colors";

export const modalStyles = StyleSheet.create({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.PURE_BLACK(0.2),
    zIndex: "11",
    borderRadius: 5,
  },
  modal: {
    background: colors.WHITE(),
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: `0 1px 3px ${colors.PURE_BLACK(0.12)}, 
    0 1px 2px ${colors.PURE_BLACK(0.24)}`,
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: colors.WHITE(),
    padding: "50px 0px 30px 0px",
    width: 625,
    height: "100%",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontWeight: "500",
    width: 426,
    fontSize: 26,
    color: colors.DARK_DESATURATED_BLUE(),
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: colors.VERY_DARK_GRAYISH_BLUE3(),
  },
  text: {
    fontFamily: "Roboto",
  },
  centerContent: {
    margin: "0px 40px",
    padding: "0px 40px",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    bottom: 0,
    marginTop: 20,
  },
  logo: {
    height: 30,
    userSelect: "none",
  },
});

export const selectStyles = StyleSheet.create({
  container: {
    width: 150,
    margin: 0,
    "@media only screen and (max-width: 1343px)": {
      // width: 220,
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
    },
    "@media only screen and (max-width: 895px)": {
      width: 125,
    },
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      height: 45,
      margin: "10px 0px 10px 0px",
    },
    "@media only screen and (max-width: 375px)": {
      width: 345,
    },
    "@media only screen and (max-width: 321px)": {
      width: 300,
    },
  },
  input: {
    fontSize: 14,
    fontWeight: 500,
    height: "100%",
    backgroundColor: colors.WHITE(),
  },
});

export const checkBoxStyles = StyleSheet.create({
  labelStyle: {
    "@media only screen and (max-width: 665px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
});

export const hubStyles = StyleSheet.create({
  entry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    padding: "3px 5px",
    boxSizing: "content-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    border: `1px solid ${colors.WHITE()}`,
    ":hover": {
      borderColor: colors.LIGHT_GREY_BACKGROUND,
      backgroundColor: colors.INPUT_BACKGROUND_GREY,
    },
  },
  list: {
    width: "90%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "0px 30px",
    "@media only screen and (max-width: 1303px)": {
      padding: "0px 20px",
    },
  },
});

export const defaultStyles = StyleSheet.create({
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: colors.DARK_DESATURATED_BLUE(),
    cursor: "default",
    userSelect: "none",
  },
  subtitle: {
    fontFamily: "Roboto",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    color: colors.PURE_BLACK(),
    fontWeight: "400",
    fontSize: "33px",
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 1343px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 22,
      fontWeight: 500,
      marginBottom: 10,
    },
    "@media only screen and (max-width: 416px)": {
      fontWeight: 400,
      fontSize: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  listLabel: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: colors.DARK_GREYISH_BLUE5(),
    transition: "all ease-out 0.1s",
    width: "90%",
    paddingLeft: 35,
    boxSizing: "border-box",
    ":hover": {
      color: colors.BLACK(),
    },
    "@media only screen and (max-width: 1303px)": {
      paddingLeft: 25,
    },
  },
  button: {
    backgroundColor: colors.NEW_BLUE(1),
    border: "none",
    borderRadius: 4,
    color: colors.WHITE(),
    cursor: "pointer",
    fontFamily: "Roboto",
    fontSize: 16,
    height: 45,
    highlight: "none",
    padding: "8px 32px",
    outline: "none",
    userSelect: "none",
    ":hover": {
      backgroundColor: colors.BRIGHT_BLUE2(),
    },
  },
  secondaryButton: {
    background: colors.WHITE(),
    border: "1px solid",
    borderColor: colors.PURPLE(1),
    borderRadius: 4,
    color: colors.PURPLE(1),
    cursor: "pointer",
    fontFamily: "Roboto",
    fontSize: 16,
    height: 45,
    outline: "none",
    padding: "8px 32px",
    textAlign: "center",
    textDecoration: "none",
    verticalAlign: "center",
    ":hover": {
      borderColor: colors.WHITE(),
      color: colors.WHITE(),
      backgroundColor: colors.PURPLE(1),
    },
    "@media only screen and (max-width: 415px)": {
      padding: "6px 24px",
      height: "auto",
      minHeight: 45,
    },
  },
});

export const column = (params = {}) => {
  const { justifyContent, alignItems } = params;

  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: justifyContent ? justifyContent : "center",
    alignItems: alignItems ? alignItems : "center",
  };
};

export const row = (params = {}) => {
  const { justifyContent, alignItems } = params;

  return {
    display: "flex",
    justifyContent: justifyContent ? justifyContent : "center",
    alignItems: alignItems ? alignItems : "center",
  };
};
