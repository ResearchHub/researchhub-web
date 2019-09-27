import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

const DraftEditor = dynamic(() => import("../../DraftEditor/DraftEditor"), {
  ssr: false,
});

const PDFViewer = dynamic(import("../../Paper/Tabs/PaperTab"), { ssr: false });

class SummaryTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: true,
      editorState: EditorState.createEmpty(),
      menuOpen: false,
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  };

  save = ({ raw }) => {
    let param = { summary: raw, paper: this.props.paperId };
    fetch(API.SUMMARY({}), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {});
  };

  cancel = () => {
    this.setState({
      readOnly: true,
    });
  };

  getSummary = () => {
    fetch(
      API.SUMMARY({ summaryId: this.props.paper.summary.id }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let contentState = convertFromRaw(resp.summary);
        let editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
        });
      });
  };

  edit = () => {
    this.setState({
      readOnly: false,
    });
  };

  componentDidMount() {
    let contentState = convertFromRaw(this.props.paper.summary.summary);
    let editorState = EditorState.createWithContent(contentState);
    this.setState({
      editorState,
    });
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.paper.summary !== this.props.paper.summary) {
      let contentState = convertFromRaw(this.props.paper.summary.summary);
      let editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  };
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.summaryActions)}>
          <div className={css(styles.action)}>View Edit History</div>
          <div className={css(styles.action)} onClick={this.edit}>
            <div className={css(styles.pencilIcon)}>
              <i className="fas fa-pencil"></i>
            </div>
            Edit Summary
          </div>
        </div>
        <DraftEditor
          paperId={this.props.paperId}
          readOnly={this.state.readOnly}
          editorState={this.state.editorState}
          onEditorStateChange={this.onEditorStateChange}
          save={this.save}
          cancel={this.cancel}
        />
      </div>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: "30px 70px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
  },
  summaryActions: {
    width: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  action: {
    color: "#241F3A",
    fontSize: 16,
    opacity: 0.6,
    display: "flex",
    cursor: "pointer",
  },
  pencilIcon: {
    marginRight: 5,
  },
});

export default withRouter(SummaryTab);
