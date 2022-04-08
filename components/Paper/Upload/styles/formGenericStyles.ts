import { StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import colors from "../../../../config/themes/colors";

export const customStyles = {
  container: {
    width: 600,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  input: {
    width: 600,
    display: "flex",
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  capitalize: {
    textTransform: "capitalize",
  },
};

export const formGenericStyles = StyleSheet.create({
  background: {
    backgroundColor: "#FCFCFC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    scrollBehavior: "smooth",
    position: "relative",
    minHeight: "100vh",
  },
  text: {
    fontFamily: "Roboto",
  },
  title: {
    fontWeight: 500,
    fontSize: 28,
    color: "#232038",
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
  },
  subtitle: {
    fontSize: 16,
    color: "#6f6c7d",
    marginTop: 10,
    "@media only screen and (max-width: 665px)": {
      width: 300,
      textAlign: "center",
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pageContent: {
    position: "relative",
    backgroundColor: "#FFF",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "30px 60px",
    marginTop: 40,
    overflowY: "scroll",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: 600,
      padding: 32,
      marginTop: 16,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "calc(100% - 16px)",
      padding: 16,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      borderTop: "unset",
    },
  },
  header: {
    fontSize: 22,
    fontWeight: 500,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottom: `1px solid #EBEBEB`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 18,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 16,
    },
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      fontSize: 14,
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  noBorder: {
    border: "none",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    width: 600,
    alignItems: "center",
    position: "relative",
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  minHeight: {
    height: 90,
  },
  mobileColumn: {
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  },
  paper: {
    width: 601,
    marginTop: 15,
    // marginBottom: 40,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  asterick: {
    color: colors.BLUE(1),
  },
  padding: {
    margin: 0,
    "@media only screen and (max-width: 665px)": {
      paddingTop: 20,
    },
  },
  container: {
    marginBottom: 10,
    width: 600,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  taglineContainer: {
    padding: 0,
    margin: 0,
    marginBottom: 20,
    width: 600,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  inputStyle: {
    // width: '100%',
    // "@media only screen and (min-width: 1024px)": {
    //   width: 570,
    // }
  },
  inputMax: {
    width: "100%",
  },
  search: {
    width: 555,
  },
  authorCheckboxContainer: {
    justifyContent: "flex-start",
    width: 600,
    marginBottom: 20,
  },
  smallContainer: {
    width: 290,
    marginTop: 10,
    marginBottom: 0,
    "@media only screen and (max-width: 665px)": {
      width: 180,
    },
    "@media only screen and (max-width: 415px)": {
      width: 159,
    },
    "@media only screen and (max-width: 321px)": {
      width: 125,
    },
  },
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
  smallInput: {
    width: 156,
  },
  checkboxRow: {
    width: 290,
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  leftAlign: {
    alignItems: "flex-start",
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
    marginTop: 30,
    paddingBottom: 20,
    marginBottom: 10,
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
    },
    "@media only screen and (max-width: 665px)": {
      width: "90%",
    },
  },
  buttons: {
    justifyContent: "center",
  },
  button: {
    width: 180,
    height: 55,
    "@media only screen and (max-width: 551px)": {
      width: 160,
    },
    "@media only screen and (max-width: 415px)": {
      width: 130,
    },
  },
  buttonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  backButton: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: colors.BLUE(1),
    fontFamily: "Roboto",
    fontSize: 16,
    position: "absolute",
    left: 0,
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 935px)": {
      bottom: 0,
    },
  },
  backButtonIcon: {
    height: 12,
    width: 7,
    marginRight: 10,
  },
  headerButton: {
    fontSize: 16,
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  draftEditor: {
    marginTop: 25,
    height: 800,
    minHeight: 800,
    maxHeight: 800,
    overflowY: "scroll",
    "::-webkit-scrollbar": {
      marginLeft: 15,
    },
  },
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  discussionTextEditor: {
    width: 600,
    height: 300,
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  doiInput: {
    width: "100%",
    marginTop: 10,
    marginBottom: 0,
  },
  doi: {
    width: "100%",
    height: 90,
    transition: "all ease-in-out 0.2s",
    opacity: 1,
    overflow: "hidden",
    display: "unset",
    "@media only screen and (max-width: 665px)": {
      display: "none",
    },
  },
  mobileDoi: {
    width: 290,
    height: 0,
    transition: "all ease-in-out 0.2s",
    opacity: 0,
    overflow: "hidden",
    display: "none",
    "@media only screen and (max-width: 665px)": {
      width: 380,
      display: "unset",
      opacity: 1,
      height: 90,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  reveal: {
    height: 90,
    opacity: 1,
  },
  taglineHeader: {
    marginTop: 20,
  },
  tagline: {
    position: "relative",
    paddingTop: 20,
    // marginBottom: 40,
  },
  taglineCounter: {
    position: "absolute",
    bottom: 0,
    right: 0,
    fontSize: 12,
    color: "rgb(122, 120, 135)",
  },
  sidenote: {
    fontSize: 14,
    fontWeight: 400,
    color: "#7a7887",
    userSelect: "none",
    cursor: "default",
    display: "flex",
    alignItems: "flex-end",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 10,
    },
  },
  authorGuidelines: {
    fontSize: 14,
    letterSpacing: 0.3,
    textDecoration: "none",
    "@media only screen and (max-width: 665px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 10,
    },
  },
  type: {
    color: colors.BLUE(),
    cursor: "pointer",
    backgroundColor: "#f7f7fb",
    padding: "3px 10px",
    border: "1px solid rgb(232, 232, 242)",
    borderBottomColor: "#f7f7fb",
    position: "absolute",
    right: -1,
    bottom: -2,
    zIndex: 2,
  },
});
