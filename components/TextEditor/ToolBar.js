import { css, StyleSheet } from "aphrodite";

export const Button = (props) => {
  const { active, onMouseDown } = props;

  const classNames = [];

  if (active) {
    classNames.push(styles.buttonActive);
  }

  function onClick(e) {
    console.log(onMouseDown);
    onMouseDown(e);
  }

  return (
    <button className={css(classNames)} onClick={onClick}>
      {props.children}
    </button>
  );
};

export const Icon = (props) => {
  return <span>{props.children}</span>;
};

export const ToolBar = (props) => {
  return <div>{props.children}</div>;
};

const styles = StyleSheet.create({
  buttonActive: {
    backgroundColor: "blue",
  },
});
