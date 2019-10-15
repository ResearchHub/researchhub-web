import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";

export const Button = (props) => {
  const { active, onMouseDown, first } = props;

  const classNames = [styles.button];

  if (active) {
    classNames.push(styles.buttonActive);
  }

  if (first) {
    classNames.push(styles.first);
  }

  // function onClick(e) {
  //   onMouseDown(e);
  // }

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
        props.summaryEditor && styles.toolbarSummary
      )}
    >
      <div>{props.children}</div>
      {!props.hideButton && (
        <button className={css(styles.submit)} onClick={props.submit}>
          Submit
        </button>
      )}
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
  },
  submit: {
    background: colors.PURPLE(1),
    color: "#fff",
    border: "none",
    fontVariant: "small-caps",
    padding: "12px 36px",
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
    borderRadius: 4,
  },
  first: {
    marginLeft: 0,
  },
});
