import { useState, useEffect } from "react";

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

  return <a onClick={() => toggleEditMode(true)}>{text}</a>;
};

export default EditAction;
