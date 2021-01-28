import { StyleSheet, css } from "aphrodite";
import FormSelect from "~/components/Form/FormSelect";

const MainHeader = (props) => {
  const {
    titleBoxShadow,
    home,
    hub,
    title,
    hubName,
    subscribeButton,
    filterOptions,
    scopeOptions,
    filterBy,
    onFilterSelect,
    scope,
    onScopeSelect,
    disableScope,
  } = props;

  return (
    <div
      className={css(
        styles.column,
        styles.topbar,
        titleBoxShadow && styles.titleBoxShadow,
        home && styles.row
      )}
    >
      <h1 className={css(styles.feedTitle)}>
        <span className={css(styles.fullWidth)}>
          {title}
          <span className={css(styles.hubName)}>{hubName}</span>
        </span>
      </h1>
      <div
        className={css(
          styles.inputContainer,
          home ? styles.homeInputContainer : styles.hubInputContainer
        )}
      >
        <div
          className={css(styles.subscribeContainer, home && styles.hideBanner)}
        >
          {hub && subscribeButton}
        </div>
        <div className={css(styles.row, styles.inputs)}>
          <FormSelect
            id={"filterBy"}
            options={filterOptions}
            value={filterBy}
            containerStyle={styles.dropDownLeft}
            inputStyle={{
              fontWeight: 500,
              minHeight: "unset",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "space-between",
            }}
            onChange={onFilterSelect}
            isSearchable={false}
          />
          <FormSelect
            id={"scope"}
            options={scopeOptions}
            value={scope}
            containerStyle={[
              styles.dropDown,
              disableScope && styles.disableScope,
            ]}
            inputStyle={{
              fontWeight: 500,
              minHeight: "unset",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "space-between",
            }}
            onChange={onScopeSelect}
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontFamily: "Roboto",
    cursor: "default",
  },
  disableScope: {
    pointerEvents: "none",
    cursor: "not-allowed",
    opacity: 0.4,
  },
  banner: {
    width: "100%",
  },
  /**
   * MAIN FEED STYLES
   */

  feedTitle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 30,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    width: "100%",
    textAlign: "center",
    padding: 0,
    margin: 0,
    "@media only screen and (min-width: 800px)": {
      textAlign: "left",
      paddingRight: 16,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 30,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  fullWidth: {
    width: "100%",
    boxSizing: "border-box",
  },
  titleBoxShadow: {
    boxShadow: "0 4px 41px -24px rgba(0,0,0,0.16)",
  },
  topbar: {
    paddingTop: 30,
    paddingBottom: 20,
    width: "100%",
    paddingLeft: 70,
    paddingRight: 70,
    boxSizing: "border-box",
    // backgroundColor: "#FCFCFC",
    alignItems: "center",
    zIndex: 2,
    top: 80,
    "@media only screen and (min-width: 900px)": {
      paddingLeft: 25,
      paddingRight: 25,
    },
    "@media only screen and (min-width: 1200px)": {
      paddingLeft: 50,
      paddingRight: 50,
    },

    "@media only screen and (max-width: 767px)": {
      position: "relative",
      top: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    "@media only screen and (max-width: 665px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingBottom: 20,
    },
  },
  dropDown: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "calc(50% - 5px)",
      fontSize: 14,
    },
  },
  dropDownLeft: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 10,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "calc(50% - 5px)",
    },
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media only screen and (max-width: 1149px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  hubInputContainer: {
    width: "100%",
    marginTop: 16,
  },
  homeInputContainer: {
    justifyContent: "flex-end",

    "@media only screen and (max-width: 799px)": {
      width: "100%",
      marginTop: 16,
    },
  },
  inputs: {
    "@media only screen and (max-width: 779px)": {
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  },
  hubName: {
    textTransform: "capitalize",
    marginRight: 13,
    "@media only screen and (max-width: 1343px)": {
      marginRight: 8,
    },
    "@media only screen and (max-width: 1149px)": {
      marginRight: 5,
    },
  },
  subscribeContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 665px)": {
      marginRight: 10,
    },
    "@media only screen and (max-width: 799px)": {
      marginRight: 0,
      width: "100%",
      justifyContent: "center",
      marginBottom: 16,
    },
  },
});

export default MainHeader;
