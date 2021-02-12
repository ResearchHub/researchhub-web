import { StyleSheet, css } from "aphrodite";
import FormSelect from "~/components/Form/FormSelect";
import { capitalize } from "~/config/utils";

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

  const renderFilters = (options = {}) => {
    const { smallWindow } = options;

    return (
      <div
        className={css(
          styles.row,
          styles.inputs,
          smallWindow && styles.smallWindow
        )}
      >
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
    );
  };

  return (
    <div
      className={css(
        styles.column,
        styles.topbar,
        titleBoxShadow && styles.titleBoxShadow,
        home && styles.row
      )}
    >
      <div className={css(styles.headerContainer)}>
        <div className={css(styles.titleContainer)}>
          <h1 className={css(styles.title) + " clamp1"}>{`${title} ${capitalize(
            hubName
          )}`}</h1>
          <div
            className={css(styles.subscribeContainer, home && styles.hidden)}
          >
            {hub && subscribeButton}
          </div>
        </div>
        {renderFilters({ smallWindow: false })}
      </div>
      <div
        className={css(
          styles.inputContainer,
          home ? styles.homeInputContainer : styles.hubInputContainer
        )}
      >
        <div
          className={css(
            styles.subscribeContainer,
            styles.mobile,
            home && styles.hidden
          )}
        >
          {hub && subscribeButton}
        </div>
        {renderFilters({ smallWindow: true })}
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

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      textAlign: "center",
      justifyContent: "center",
    },
  },
  title: {
    color: "#241F3A",
    width: "100%",
    fontWeight: 400,
    fontSize: 30,
    padding: 0,
    margin: 0,
    textOverflow: "ellipsis",

    "@media only screen and (max-width: 1149px)": {
      fontSize: 30,
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 25,
      textAlign: "center",
      justifyContent: "center",
      whiteSpace: "pre-wrap",
      wordBreak: "normal",
      display: "flex",
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  feedTitleMargin: {
    marginTop: -3,
  },
  fullWidth: {
    display: "flex",
    boxSizing: "border-box",
  },
  titleBoxShadow: {
    boxShadow: "0 4px 41px -24px rgba(0,0,0,0.16)",
  },
  topbar: {
    paddingTop: 30,
    paddingBottom: 20,
    width: "100%",
    boxSizing: "border-box",
    alignItems: "flex-start",
    zIndex: 2,
    top: 80,
    "@media only screen and (max-width: 767px)": {
      position: "relative",
      top: 0,
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
    borderRadius: 3,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 767px)": {
      width: "calc(50% - 5px)",
    },
  },
  dropDownLeft: {
    width: 140,
    margin: 0,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 10,
    borderRadius: 3,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  hubInputContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    "@media only screen and (max-width: 1300px)": {
      marginTop: 15,
    },
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      marginTop: 16,
    },
  },
  homeInputContainer: {
    justifyContent: "flex-end",

    "@media only screen and (max-width: 767px)": {
      width: "100%",
      marginTop: 16,
    },
  },
  inputs: {
    display: "flex",
    justifyContent: "flex-end",
    width: "max-content",
    alignItems: "center",
    "@media only screen and (max-width: 1300px)": {
      display: "none",
    },
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  },
  hubName: {
    textTransform: "capitalize",
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
    marginLeft: 15,
    minWidth: 100,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      margin: 0,
      width: "100%",
      justifyContent: "center",
      marginBottom: 16,
    },
  },
  hidden: {
    display: "none",
    margin: 0,
    padding: 0,
    height: 0,
    "@media only screen and (max-width: 767px)": {
      display: "none",
      margin: 0,
      padding: 0,
      height: 0,
    },
  },

  smallWindow: {
    display: "none",
    "@media only screen and (max-width: 1300px)": {
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
    },
  },
  titleContainer: {
    display: "flex",
  },
});

export default MainHeader;
