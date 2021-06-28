const Tag = ({ onClick, onRemove }) => {};

const styles = StyleSheet.create({
  filters: {
    display: "flex",
  },
  containerStyle: {
    width: 250,
  },
  dropdown: {
    width: 200,
  },
  selectedFiltersList: {
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    padding: "2px 8px",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    textTransform: "capitalize",
  },
  badge: {
    display: "flex",
    margin: "2px",
    minWidth: "0",
    boxSizing: "border-box",
    backgroundColor: "#edeefe",
    borderRadius: "2px",
    color: colors.BLUE(),
    cursor: "pointer",
  },
  badgeLabel: {
    borderRadius: "2px",
    fontSize: "85%",
    overflow: "hidden",
    padding: "3px",
    paddingLeft: "6px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  badgeRemove: {
    display: "flex",
    paddingLeft: "4px",
    paddingRight: "4px",
    boxSizing: "border-box",
    alignItems: "center",
    borderRadius: "2px",
  },
  highlight: {
    backgroundColor: "yellow",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  clearFiltersBtn: {
    backgroundColor: "none",
    color: colors.RED(),
    fontSize: 12,
  },
  clearFiltersX: {
    color: colors.RED(),
  },
});

export default Tag;
