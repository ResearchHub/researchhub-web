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

  function onClick(e) {
    console.log(onMouseDown);
    onMouseDown(e);
  }

  return (
    <span className={css(classNames)} onClick={onClick}>
      {props.children}
    </span>
  );
};

export const Icon = (props) => {
  return <span>{props.children}</span>;
};

export const ToolBar = (props) => {
  return (
    <div className={css(styles.toolbar)}>
      <div>{props.children}</div>
      <button className={css(styles.submit)} onClick={props.submit}>
        Submit
      </button>
    </div>
  );
};

const styles = StyleSheet.create({
  buttonActive: {
    color: colors.BLACK(1),
  },
  first: {
    marginLeft: 0,
  },
  button: {
    color: "rgb(204, 204, 204)",
    cursor: "pointer",
    marginLeft: 15,
  },
  toolbar: {
    borderTop: "1px solid",
    borderColor: "rgb(235, 235, 235)",
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
});
