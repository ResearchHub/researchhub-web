import { Value } from "slate";
import { Editor } from "slate-react";
import Plain from "slate-plain-serializer";

const defaultValue = Value.fromJSON({
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
                text: "No value provided",
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
  return <Editor value={initialValue || defaultValue} readOnly={true} />;
};

export default ReadOnlyEdtior;
