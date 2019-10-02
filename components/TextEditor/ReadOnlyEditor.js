import { Value } from "slate";
import { Editor } from "slate-react";

const defaultInitialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "No initial value",
              },
            ],
          },
        ],
      },
    ],
  },
});

const ReadOnlyEdtior = (props) => {
  const { initialValue } = props;
  return <Editor value={initialValue || defaultInitialValue} readOnly={true} />;
};

export default ReadOnlyEdtior;
