import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

const EditAction = (props) => {
  const { onClick, readOnly } = props;

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
