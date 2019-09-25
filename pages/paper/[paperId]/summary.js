import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";

// Components
import dynamic from "next/dynamic";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

const DraftEditor = dynamic(
  () => import("../../../components/DraftEditor/DraftEditor"),
  { ssr: false }
);

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: true,
      editorState: EditorState.createEmpty()
    };
  }

  onEditorStateChange = editorState => {
    this.setState({ editorState });
  };

  save = ({ raw }) => {
    let param = { summary: raw, paper: this.props.paperId };
    fetch(API.SUMMARY(), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(resp => {});
  };

  getSummary = () => {
    let { query } = this.props.router;
    fetch(API.SUMMARY({ summaryId: query.paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(resp => {
        let contentState = convertFromRaw(resp.summary);
        let editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState
        });
      });
  };

  edit = () => {
    this.setState({
      readOnly: false
    });
  };

  componentDidMount = () => {
    this.getSummary();
  };
  render() {
    let { query } = this.props.router;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.summaryActions)}>
          <div className={css(styles.button)} onClick={() => this.edit()}>
            edit
          </div>
        </div>
        <DraftEditor
          paperId={query.paperId}
          readOnly={this.state.readOnly}
          editorState={this.state.editorState}
          onEditorStateChange={this.onEditorStateChange}
          save={this.save}
        />
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
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box"
  },
  summaryActions: {
    width: 50
  }
});

export default withRouter(Summary);
