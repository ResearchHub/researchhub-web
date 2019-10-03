import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { StyleSheet, css } from "aphrodite";
import { Map } from "immutable";

// Components
import TeXBlock from "./ToolbarOptions/TeXBlock";
import {
  insertTeXBlock,
  removeTeXBlock,
} from "./ToolbarOptions/TexBlockFunctions";

//Config
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import colors from "~/config/themes/colors";

const DEFAULT_OPTIONS = {
  options: ["inline", "blockType", "fontSize", "list", "textAlign", "history"],
  inline: {
    options: ["bold", "italic", "underline", "strikethrough", "monospace"],
  },
};

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //liveTeXEdits: Map(),
      options: { ...DEFAULT_OPTIONS },
    };
  }

  onEditorStateChange = (editorState) => {
    this.props.onEditorStateChange(editorState);
  };

  /*  _TeXBlockRenderer = block => {
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
  };*/

  save = () => {
    let contentState = this.props.editorState.getCurrentContent();
    let raw = convertToRaw(contentState);
    this.props.save({ raw });
  };

  cancel = () => {
    this.props.cancel();
  };

  render() {
    return (
      <div className={css(styles.editorContainer)}>
        <Editor
          editorState={this.props.editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={this.state.options}
          readOnly={this.props.readOnly}
          toolbarHidden={this.props.readOnly}
          //customBlockRenderFunc={this._TeXBlockRenderer}
          //toolbarCustomButtons={this._TeXBlockButton}
        />
        {!this.props.readOnly && !this.props.hideButtons && (
          <div className={css(styles.editorActions)}>
            <button
              className={css(styles.button, styles.cancel)}
              onClick={() => this.cancel()}
            >
              Cancel
            </button>
            <button
              className={css(styles.button, styles.submit)}
              onClick={() => this.save()}
            >
              Propose Change
            </button>
          </div>
        )}
      </div>
    );
  }
}

var styles = StyleSheet.create({
  editorContainer: {
    width: "100%",
  },
  editorActions: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    width: 180,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
    cursor: "pointer",
  },
  cancel: {
    background: "transparent",
    color: colors.BLUE(),
  },
  submit: {
    background: colors.BLUE(),
    color: "#fff",
  },
});

export default DraftEditor;
