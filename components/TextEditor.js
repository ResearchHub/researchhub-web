import { Fragment, useState } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import Plain from "slate-plain-serializer";

const TextEditor = (props) => {
  let { placeholder, submitButton } = props;

  if (!placeholder) {
    placeholder = "Enter some text...";
  }

  const initialValue = Plain.deserialize(placeholder);
  const [value, setValue] = useState(initialValue);

  function submit(value) {
    console.log(value);
  }

  return (
    <Fragment>
      <Editor value={value} onChange={(change) => setValue(change.value)} />
      {submitButton}
    </Fragment>
  );
};

export default TextEditor;
