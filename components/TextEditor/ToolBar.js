import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";
import FormButton from "../Form/Button";
import Loader from "../Loader/Loader";

export const Button = (props) => {
  const { active, onMouseDown, first, smallToolBar } = props;

  const classNames = [styles.button];

  if (active) {
    classNames.push(styles.buttonActive);
  }

  if (smallToolBar) {
    classNames.push(styles.smallToolBarButton);
  }

  if (first) {
    classNames.push(styles.first);
  }

  return (
    <span className={css(classNames)} onMouseDown={onMouseDown}>
      {props.children}
    </span>
  );
};

export const Icon = (props) => {
  return <span>{props.children}</span>;
};

export const ToolBar = (props) => {
  return (
    <div
      className={css(
        styles.toolbar,
        props.summaryEditor && styles.toolbarSummary,
        props.smallToolBar && styles.smallToolBar
      )}
    >
      <div className={css(styles.iconRow)}>{props.children}</div>
      <div className={css(styles.buttonRow)}>
        {!props.hideButton && !props.hideCancelButton && (
          <FormButton
            isWhite={true}
            onClick={props.cancel}
            label={props.smallToolBar ? "Hide" : "Cancel"}
            size={props.smallToolBar && "med"}
            customButtonStyle={
              props.smallToolBar ? styles.smallButton : styles.cancelButton
            }
          />
        )}
        <span className={css(styles.divider)} />
        {!props.hideButton &&
          (props.loading ? (
            <FormButton
              onClick={null}
              label={<Loader loading={true} color={"#FFF"} size={20} />}
              size={props.smallToolBar && "med"}
              customButtonStyle={
                props.smallToolBar ? styles.smallButton : styles.buttonStyle
              }
            />
          ) : (
            <FormButton
              onClick={props.submit}
              label="Submit"
              size={props.smallToolBar && "med"}
              customButtonStyle={
                props.smallToolBar ? styles.smallButton : styles.buttonStyle
              }
            />
          ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  buttonActive: {
    color: colors.BLACK(1),
  },
  button: {
    color: "rgb(204, 204, 204)",
    cursor: "pointer",
    marginLeft: 24,
    ":hover": {
      color: colors.BLACK(1),
    },
  },
  toolbarSummary: {
    borderBottom: "1px solid",
    borderTop: 0,
    borderColor: "rgb(235, 235, 235)",
    background: "#fff",
    paddingLeft: 0,
  },
  toolbar: {
    borderTop: "1px solid",
    borderColor: "rgb(235, 235, 235)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    background: "#fff",
    "@media only screen and (max-width: 577px)": {
      flexDirection: "column",
    },
  },
  iconRow: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  smallToolBar: {
    fontSize: 11,
    display: "flex",
    flexWrap: "flex-wrap",
    "@media only screen and (max-width: 415px)": {
      fontSize: 9,
    },
  },
  smallToolBarButton: {
    marginLeft: 10,
    padding: 5,
    ":hover": {
      color: colors.BLACK(1),
      backgroundColor: "#FAFAFA",
    },
    "@media only screen and (max-width: 415px)": {
      margin: 5,
      marginLeft: 0,
    },
  },
  submit: {
    background: colors.PURPLE(1),
    color: "#fff",
    border: "none",
    // fontVariant: "small-caps",
    padding: "12px 36px",
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
    borderRadius: 4,
  },
  first: {
    marginLeft: 0,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    "@media only screen and (max-width: 577px)": {
      marginTop: 16,
    },
  },
  cancelButton: {
    // marginRight: 10,
    "@media only screen and (max-width: 577px)": {
      width: 100,
    },
  },
  buttonStyle: {
    "@media only screen and (max-width: 577px)": {
      width: 100,
    },
  },
  smallButton: {
    // padding: "1px 0px",
  },
  divider: {
    width: 10,
  },
});
