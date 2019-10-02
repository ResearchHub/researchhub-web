import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";

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
    let param = {
      summary: raw,
      paper: this.props.paperId,
      previousSummaryId: this.props.paper.summary.id,
    };
    fetch(API.PROPOSE_EDIT({}), API.POST_CONFIG(param))
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
    /*

    TODO: Let's refactor this.

    Foremost this needs a shim to accomodate backend api changes.

    It may be best to move all of this fetching logic to redux and
    keep track of (at least) fetch failure/success and (probably) the summary
    content in global state.

    */
    const { paper } = this.props;
    if (paper.summary) {
      if (paper.summary.summary) {
        let contentState = convertFromRaw(paper.summary.summary);
        let editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
        });
      }
    }
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
      <ComponentWrapper>
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
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
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
