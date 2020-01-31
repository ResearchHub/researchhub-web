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
      <div>{props.children}</div>
      <div className={css(styles.buttonRow)}>
        {!props.hideButton && !props.hideCancelButton && (
          <FormButton
            isWhite={true}
            onClick={props.cancel}
            label="Cancel"
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
              customButtonStyle={
                props.smallToolBar ? styles.smallButton : styles.buttonStyle
              }
            />
          ) : (
            <FormButton
              onClick={props.submit}
              label="Submit"
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
  },
  toolbar: {
    borderTop: "1px solid",
    borderColor: "rgb(235, 235, 235)",
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    "@media only screen and (max-width: 577px)": {
      flexDirection: "column",
    },
  },
  smallToolBar: {
    fontSize: 11,
    display: "flex",
    flexWrap: "flex-wrap",
  },
  smallToolBarButton: {
    marginLeft: 10,
    padding: 5,
    ":hover": {
      color: colors.BLACK(1),
      backgroundColor: "#FAFAFA",
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
    justifyContent: "space-between",
    alignItems: "center",

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
    width: 80,
    height: 30,
  },
  divider: {
    width: 10,
  },
});
