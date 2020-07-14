// Config
import colors from "~/config/themes/colors";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { css, StyleSheet } from "aphrodite";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: "snow",
      enabled: true,
      readOnly: false,
      value: this.props.value ? this.props.value : { ops: [] },
      events: [],
      uid: this.id(),
    };
  }

  formatRange(range) {
    return range ? [range.index, range.index + range.length].join(",") : "none";
  }

  onEditorChange = (value, delta, source, editor) => {
    console.log("editor.getContents()", editor.getContents());
    // console.log(value);
    // console.log("html", editor.getHTML());
    // console.log("text", editor.getText());
    this.setState({
      value: editor.getContents(),
      events: [`[${source}] text-change`, ...this.state.events],
    });
  };

  onEditorChangeSelection = (range, source) => {
    this.state.selection !== range &&
      this.setState({
        selection: range,
        events: [
          `[${source}] selection-change(${this.formatRange(
            this.state.selection
          )} -> ${this.formatRange(range)})`,
          ...this.state.events,
        ],
      });
  };

  onEditorFocus = (range, source) => {
    this.setState({
      events: [`[${source}] focus(${this.formatRange(range)})`].concat(
        this.state.events
      ),
    });
  };

  onEditorBlur = (previousRange, source) => {
    this.setState({
      events: [`[${source}] blur(${this.formatRange(previousRange)})`].concat(
        this.state.events
      ),
    });
  };

  handleEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  id = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  };

  renderToolbar = (id) => {
    var state = this.state;
    var enabled = state.enabled;
    var readOnly = state.readOnly;
    var selection = this.formatRange(state.selection);
    return (
      <div id={"#" + id} className={"ql-toolbar"} onClick={this.handleEvent}>
        {/* <select className="ql-size">
          <option value={"header-1"} className={css(styles.headerOne)}>Header 1</option>
          <option value={"header-2"} className={css(styles.headerTwo)}>Header 2</option>
          <option value={"body"} className={css(styles.body)} selected>Body</option>
        </select> */}
        <span className="ql-formats">
          <button
            className="ql-list"
            value="ordered"
            onClick={this.handleEvent}
          />
          <button
            className="ql-list"
            value="bullet"
            onClick={this.handleEvent}
          />
          <button className="ql-indent" value="-1" onClick={this.handleEvent} />
          <button className="ql-indent" value="+1" onClick={this.handleEvent} />
        </span>
        <button className="ql-bold" onClick={this.handleEvent} />
        <button className="ql-italic" onClick={this.handleEvent} />
        <button className="ql-underline" onClick={this.handleEvent} />
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
        </span>
      </div>
    );
  };

  renderButtons = () => {};

  render() {
    return (
      <div className={css(styles.editor, this.props.containerStyles)}>
        <div
          className={css(
            styles.commentEditor,
            this.props.commentEditorStyles && this.props.commentEditorStyles
          )}
        >
          {this.renderToolbar(this.state.uid)}
          <ReactQuill
            theme={"snow"}
            readOnly={this.state.readOnly}
            onChange={this.onEditorChange}
            onChangeSelection={this.onEditorChangeSelection}
            onFocus={this.onEditorFocus}
            onBlur={this.onEditorBlur}
            defaultValue={this.props.value}
            modules={Editor.modules(this.state.uid)}
            formats={Editor.formats}
          />
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

Editor.modules = (toolbarId) => ({
  toolbar: {
    container: "#" + toolbarId,
  },
});

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

const styles = StyleSheet.create({
  editor: {
    width: "100%",
    position: "relative",
  },
  summaryEditor: {
    width: "100%",
    fontFamily: "Roboto",
    color: "#241F3A",
    lineHeight: 1.2,
  },
  summaryEditorBox: {
    minHeight: 180,
  },
  commentEditor: {
    background: "#FBFBFD",
    border: "1px solid #fff",
    color: "#000",
    ":hover": {
      borderColor: "#E7E7E7",
    },
  },
  editSection: {
    padding: 16,
    minHeight: 122,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  comment: {
    whiteSpace: "pre-wrap",
    padding: 16,
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 0,
    },
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
    color: colors.PURPLE(),
    border: "1px solid",
    marginRight: 24,
  },
  submit: {
    background: colors.PURPLE(),
    color: "#fff",
  },
  added: {
    background: "rgba(19, 145, 26, .2)",
    color: "rgba(19, 145, 26)",
  },
  removed: {
    background: "rgba(173, 34, 21, .2)",
    color: "rgb(173, 34, 21)",
  },
  image: {
    display: "block",
    maxWidth: "100%",
    maxHeight: 500,
    opacity: 1,
  },
  deleteImage: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 30,
    color: "#fff",
    cursor: "pointer",
    zIndex: 3,
  },
  imageContainer: {
    position: "relative",
    width: "fit-content",
  },
  imageBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: "0%",
    opacity: 1,
    ":hover": {
      background: "linear-gradient(#000 1%, transparent 100%)",
      opacity: "100%",
    },
  },
  iframeContainer: {
    position: "relative",
    paddingBottom: "56.25%",
    paddingTop: 30,
    height: 0,
    overflow: "hidden",
  },
  iframe: {
    width: 543,
    height: 305.5,

    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  smallOverlay: {
    height: 60,
  },
  bold: {
    fontWeight: 500,
    color: "#241F3A",
  },
  stickyBottom: {
    position: "sticky",
    backgroundColor: "#fff",
    top: 59,
    zIndex: 3,
  },
  removeStickyToolbar: {
    position: "unset",
  },
  urlToolTip: {
    top: 60,
    bottom: "unset",
  },
  imgToolTip: {
    top: 60,
    bottom: "unset",
  },
  headerOne: {
    fontSize: 22,
    fontWeight: 500,
    paddingBottom: 10,
  },
  headingTwo: {
    fontSize: 20,
    fontWeight: 500,
    paddingBottom: 10,
  },
});

export default Editor;
