import { useState } from "react";

const EditAction = (props) => {
  const { onClick } = props;

  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState("Edit");

  function toggleEditMode() {
    if (editMode) {
      setEditMode(false);
      setText("Edit");
      const readOnly = true;
      onClick(readOnly);
    } else {
      setEditMode(true);
      setText("Cancel");
      const readOnly = false;
      onClick(readOnly);
    }
  }

  return <a onClick={toggleEditMode}>{text}</a>;
};

export default EditAction;
