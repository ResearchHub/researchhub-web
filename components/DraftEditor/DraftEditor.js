import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { StyleSheet, css } from "aphrodite";
import { Map } from "immutable";

// Components
import TeXBlock from "./ToolbarOptions/TeXBlock";
import {
  insertTeXBlock,
  removeTeXBlock
} from "./ToolbarOptions/TexBlockFunctions";

//Config
import API from "../../config/api";
import * as config from "q5-web-config";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const options = {
  options: ["inline", "blockType", "fontSize", "list", "textAlign", "history"],
  inline: {
    options: ["bold", "italic", "underline", "strikethrough", "monospace"]
  }
};

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      liveTeXEdits: Map()
    };
  }

  onEditorStateChange = editorState => {
    this.setState({ editorState });
  };

  _TeXBlockRenderer = block => {
    if (block.getType() === "atomic") {
      return {
        component: TeXBlock,
        editable: false,
        props: {
          onStartEdit: blockKey => {
            var { liveTeXEdits } = this.state;
            this.setState({ liveTeXEdits: liveTeXEdits.set(blockKey, true) });
          },
          onFinishEdit: (blockKey, newContentState) => {
            var { liveTeXEdits } = this.state;
            this.setState({
              liveTeXEdits: liveTeXEdits.remove(blockKey),
              editorState: EditorState.createWithContent(newContentState)
            });
          },
          onRemove: blockKey => this.removeTeX(blockKey)
        }
      };
    }
    return null;
  };

  removeTeX = blockKey => {
    var { editorState, liveTeXEdits } = this.state;
    this.setState({
      liveTeXEdits: liveTeXEdits.remove(blockKey),
      editorState: removeTeXBlock(editorState, blockKey)
    });
  };

  insertTeX = () => {
    this.setState({
      liveTeXEdits: Map(),
      editorState: insertTeXBlock(this.state.editorState)
    });
  };

  _TeXBlockButton = () => {
    return <div onClick={this.insertTeX}>TeX</div>;
  };

  save = () => {
    let contentState = this.state.editorState.getCurrentContent();
    let raw = convertToRaw(contentState);

    // let param = {summary: raw}
    // fetch((API.SUMMARY(), API.POST(param)))
    // .then(Helpers.checkStatus)
    // .then(Helpers.parseJSON)
    // .then(resp => {
    //   debugger
    // })
  };
  render() {
    console.log(config);
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={options}
          //customBlockRenderFunc={this._TeXBlockRenderer}
          //toolbarCustomButtons={this._TeXBlockButton}
        />
        ;{/*<div onClick={this.insertTeX}>
          TeX
        </div>*/}
      </div>
    );
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
