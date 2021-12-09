import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import ActionButton from "~/components/ActionButton";

const EditAction = (props) => {
  const { onClick, readOnly, iconView } = props;

  const [text, setText] = useState("Edit");

  useEffect(() => {
    toggleEditMode(false);
  }, [readOnly]);

  function toggleEditMode(click) {
    if (click) {
      onClick(!readOnly);
    } else {
      if (readOnly) {
        setText("Edit");
      } else {
        setText("Cancel");
      }
    }
  }

  if (iconView) {
    if (readOnly) {
      return (
        <ActionButton
          action={() => toggleEditMode(true)}
          icon={"pencil"}
          addRipples={true}
        />
      );
    } else {
      return (
        <ActionButton
          action={() => toggleEditMode(true)}
          icon={"times"}
          addRipples={true}
        />
      );
    }
  }

  return (
    <a className={css(styles.button)} onClick={() => toggleEditMode(true)}>
      {text}
    </a>
  );
};

const styles = StyleSheet.create({
  button: {
    cursor: "pointer",
    ":hover": {
      color: "#000",
    },
  },
});

export default EditAction;
