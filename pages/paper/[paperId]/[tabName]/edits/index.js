import Link from "next/link";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import dynamic from "next/dynamic";
import moment from "moment";
import Plain from "slate-plain-serializer";
import { Value } from "slate";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import TextEditor from "~/components/TextEditor";

// Redux
import { PaperActions } from "~/redux/paper";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const Diff = require("diff");
class PaperEditHistory extends React.Component {
  static async getInitialProps({ store, isServer, query }) {
    await store.dispatch(PaperActions.getEditHistory(query.paperId));

    return { isServer };
  }
  constructor(props) {
    super(props);

    const emptyState = Plain.deserialize("");

    this.state = {
      selectedEdit: 0,
      editorState: emptyState,
      finishedLoading: false,
    };
  }

  viewEditHistory = async () => {
    let { getEditHistory, paperId } = this.props;
    let param = {
      paper: paperId,
    };
  };

  changeEditView = (selectedIndex, edit) => {
    let { paper } = this.props;
    let summaryJSON = JSON.parse(edit.summary);
    let editorState = Value.fromJSON(summaryJSON);
    let previousSummaryJSON = JSON.parse(edit.previous__summary);
    let previousState = Value.fromJSON(previousSummaryJSON);

    debugger;
    this.setState({
      selectedEdit: selectedIndex,
      editorState,
      previousState,
    });
  };

  componentDidMount() {
    if (this.props.paper.editHistory.length > 0) {
      let edit = this.props.paper.editHistory[0];
      let summaryJSON = JSON.parse(edit.summary);
      let editorState = Value.fromJSON(summaryJSON);
      let previousSummaryJSON = JSON.parse(edit.previous__summary);
      let previousState = Value.fromJSON(previousSummaryJSON);

      let diffJSON = Diff.diffWords(
        previousSummaryJSON.document.nodes[0].nodes[0].text,
        summaryJSON.document.nodes[0].nodes[0].text
      );
      debugger;
      this.setState({
        editorState,
        previousState,
        finishedLoading: true,
      });
    }
  }

  render() {
    let { paper } = this.props;
    let editHistory = paper.editHistory.map((edit, index) => {
      return (
        <div
          key={`edit_history_${index}`}
          className={css(
            styles.editHistoryCard,
            this.state.selectedEdit === index && styles.selectedEdit
          )}
          onClick={() => this.changeEditView(index, edit)}
        >
          <div className={css(styles.date)}>
            {moment(edit.approved_at).format("MMM Do YYYY, h:mm A")}
            {index === 0 && <span>{` (Current Ver.)`}</span>}
          </div>
          <div className={css(styles.user)}>
            {`${edit.proposed_by.first_name} ${edit.proposed_by.last_name}`}
          </div>
        </div>
      );
    });
    return (
      <ComponentWrapper>
        {this.state.finishedLoading && (
          <div className={css(styles.container)}>
            <TextEditor
              canEdit={false}
              readOnly={true}
              canSubmit={false}
              commentEditor={false}
              passedValue={this.state.editorState}
              initialValue={this.state.editorState}
            />
            <div className={css(styles.editHistoryContainer)}>
              <div className={css(styles.revisionTitle)}>Revision History</div>
              {editHistory}
            </div>
          </div>
        )}
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "80%",
    display: "flex",
    boxSizing: "border-box",
    position: "relative",
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
  draftContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  editHistoryContainer: {
    position: "absolute",
    right: -280,
    background: "#F9F9FC",
  },
  selectedEdit: {
    background: "#F0F1F7",
  },
  editHistoryCard: {
    width: 250,
    padding: "5px 10px",
    cursor: "pointer",
  },
  date: {
    fontSize: 14,
    fontWeight: 500,
  },
  user: {
    fontSize: 12,
    opacity: 0.5,
  },
  revisionTitle: {
    padding: 10,
  },
});
const mapStateToProps = (state) => ({
  paper: state.paper,
});

export default connect(mapStateToProps)(withRouter(PaperEditHistory));
