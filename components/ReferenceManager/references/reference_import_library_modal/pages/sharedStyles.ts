import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const sharedStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  extraBottomPadding: {
    paddingBottom: 15,
  },

  header: {
    width: "100%",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
  },
  subtitle: {
    fontSize: 16,
    color: colors.MEDIUM_GREY(),
    marginTop: 5,
  },

  barLoaderContainer: {
    paddingTop: 4,
    paddingBottom: 8,
    width: "100%",
  },

  //  list
  listContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  listHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 8,
    gap: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.BLACK(),
  },
  listDescription: {
    fontSize: 14,
    color: colors.BLACK(),
    paddingBottom: 8,
  },

  // file list
  fileList: {
    paddingTop: 4,
    gap: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  fileItem: {
    width: "100%",
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 12,
  },

  // footer
  footer: {
    width: "100%",
    marginTop: 24,
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
  },
  footerButton: {
    minWidth: 160,
  },
});

export default sharedStyles;
