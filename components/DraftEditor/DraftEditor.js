import { Editor } from "react-draft-wysiwyg";
import { StyleSheet, css } from "aphrodite";

import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = editorState => {
    this.setState({ editorState });
  };

  render() {
    return <Editor />;
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 500,
    padding: 50,
    display: "flex",
    boxSizing: "border-box"
  },
  megadraftContainer: {
    border: "1px solid",
    borderRadius: 8,
    flex: 1,
    boxSizing: "border-box",
    padding: 10,
    cursor: "text"
  }
});

export default DraftEditor;
