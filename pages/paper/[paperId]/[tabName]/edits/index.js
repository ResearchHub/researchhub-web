import Link from "next/link";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import dynamic from "next/dynamic";
import moment from "moment";
import Plain from "slate-plain-serializer";
import { Value, KeyUtils, Text, Block } from "slate";

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

    let previousSummaryJSON = {};
    let previousState = {};

    let summaryJSON = JSON.parse(edit.summary);
    let editorState = Value.fromJSON(summaryJSON);

    if (edit.previous) {
      previousSummaryJSON = JSON.parse(edit.previous__summary);
      previousState = Value.fromJSON(previousSummaryJSON);
      editorState = this.diffVersions(editorState, previousState);
    }

    this.setState({
      selectedEdit: selectedIndex,
      editorState,
      previousState,
    });
  };

  componentDidMount() {
    if (this.props.paper.editHistory.length > 0) {
      let previousSummaryJSON = {};
      let previousState = {};

      let edit = this.props.paper.editHistory[0];
      let summaryJSON = JSON.parse(edit.summary);
      let editorState = Value.fromJSON(summaryJSON);

      if (edit.previous) {
        previousSummaryJSON = JSON.parse(edit.previous__summary);
        previousState = Value.fromJSON(previousSummaryJSON);
        editorState = this.diffVersions(editorState, previousState);
      }

      this.setState({
        editorState,
        previousState,
      });
    }
  }

  /**
   * Function of how to handle a diff. Create a new text node with the
   * diff values. Add marks based on action performed.
   * @param  {Object} diff -- diff object
   * @param  {BlockNode} node -- slate block node being diffed
   * @return {TextNode}      -- slate text node created
   */
  parseDiff = (diff, node) => {
    let diffValue = diff.value;
    let action = diff.added ? "added" : diff.removed ? "removed" : null;
    let marks = node.getMarks();
    let key = Math.floor(Math.random() * 1000000000).toString(36);
    let markedNode = Text.create({ key: key, text: diffValue, marks });

    if (diff.added || diff.removed) {
      markedNode = markedNode.addMark(action);
    }
    return markedNode;
  };

  /**
   * Function to handle all the comparisons for diffing and assembling the
   * slate value with all added marks.
   * @param  {ValueObject} editorState   -- current version slate value object
   * @param  {ValueObject} previousState -- previous version slate value object
   * @return {ValueObject}               -- new value object created from diffing the two versions
   */
  diffVersions = (editorState, previousState) => {
    let blockArray = editorState.document.getBlocksAsArray();
    let pathMap = editorState.document.getNodesToPathsMap();
    let previousPathMap = previousState.document.getNodesToPathsMap();
    let tempEditor = editorState;
    let previousBlockComplete = {};
    let previousBlockArray = previousState.document.getBlocksAsArray();

    for (let i = 0; i < previousBlockArray.length; i++) {
      previousBlockComplete[previousBlockArray[i].key] = false;
    }

    for (let i = 0; i < blockArray.length; i++) {
      let node = blockArray[i];
      let key = node.key;
      let prevNode = previousState.document.getNode(key);
      previousBlockComplete[key] = true;
      if (prevNode) {
        let diffJSON = Diff.diffWords(prevNode.text, node.text);
        if (diffJSON.length > 1 || diffJSON[0].added || diffJSON[0].removed) {
          let newTextNodes = [];
          for (let j = 0; j < diffJSON.length; j++) {
            if (diffJSON[j].added) {
              let newNode = this.parseDiff(diffJSON[j], node);
              newTextNodes.push(newNode);
            } else if (diffJSON[j].removed) {
              let newNode = this.parseDiff(diffJSON[j], prevNode);
              newTextNodes.push(newNode);
            } else {
              let newNode = this.parseDiff(diffJSON[j], node);
              newTextNodes.push(newNode);
            }
          }
          let pathToBlock = pathMap.get(node);
          let newNodes = node.getTextsAsArray();
          if (newTextNodes.length > 0) {
            newNodes = newTextNodes;
          }
          let newBlock = Block.create({
            key: key,
            nodes: newNodes,
            type: node.type,
          });
          tempEditor = editorState.removeNode(pathToBlock);
          tempEditor = tempEditor.insertNode(pathToBlock, newBlock);
        }
      } else {
        let pathToBlock = pathMap.get(node);
        let newBlock = node.addMark("added");
        tempEditor = editorState.removeNode(pathToBlock);
        tempEditor = tempEditor.insertNode(pathToBlock, newBlock);
      }
    }
    let keys = Object.keys(previousBlockComplete);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (!previousBlockComplete[key]) {
        let prevNode = previousState.document.getNode(key);
        let previousTextArray = prevNode.getTextsAsArray();
        let newBlock = prevNode;
        for (let j = 0; j < previousTextArray.length; j++) {
          let pathToText = prevNode.getPath(previousTextArray[j]);
          newBlock = prevNode.addMark(pathToText, "removed");
        }
        let pathToBlock = previousPathMap.get(prevNode);
        tempEditor = tempEditor.insertNode(pathToBlock, newBlock);
      }
    }
    return tempEditor;
  };

  // componentDidUpdate(prevState) {
  //   if (prevState.editorState !== this.state.editorState) {
  //     this.diffVersions()
  //   }
  // }

  setRef = (editor) => {
    this.editor = editor;
  };
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
        <div className={css(styles.container)}>
          <TextEditor
            canEdit={false}
            readOnly={true}
            canSubmit={false}
            commentEditor={false}
            passedValue={this.state.editorState}
            initialValue={this.state.editorState}
            setRef={this.setRef}
          />
          <div className={css(styles.editHistoryContainer)}>
            <div className={css(styles.revisionTitle)}>Revision History</div>
            {editHistory}
          </div>
        </div>
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
