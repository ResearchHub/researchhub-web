import { Fragment } from "react";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import dynamic from "next/dynamic";
import { Value } from "slate";
import moment from "moment";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import TextEditor from "~/components/TextEditor";

// Redux
import { PaperActions } from "~/redux/paper";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";

class SummaryTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: true,
      editorState: null,
      menuOpen: false,
      addSummary: false,
    };
  }

  /**
   * Opens the add summary
   */
  addSummary = () => {
    this.setState({
      addSummary: true,
      readOnly: false,
    });
  };

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  };

  saveEdit = (raw) => {
    let param = {
      summary: raw,
      paper: this.props.paperId,
      previousSummaryId: this.props.paper.summary
        ? this.props.paper.summary.id
        : null,
    };
    fetch(API.PROPOSE_EDIT({}), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        this.setState({
          readOnly: true,
        });
      });
  };

  cancel = () => {
    this.setState({
      readOnly: true,
      addSummary: false,
    });
  };

  edit = () => {
    this.setState({
      readOnly: false,
    });
  };

  componentDidMount() {
    const { paper } = this.props;
    if (paper.summary) {
      if (paper.summary.summary) {
        let summaryJSON = paper.summary.summary;
        let editorState = Value.fromJSON(summaryJSON);
        this.setState({
          editorState,
          finishedLoading: true,
        });
      }
    }
  }

  render() {
    let { paper } = this.props;
    return (
      <ComponentWrapper>
        {paper.summary.summary ? (
          <div className={css(styles.container)}>
            {this.state.readOnly ? (
              <div className={css(styles.summaryActions)}>
                <Link
                  href={"/paper/[paperId]/[tabName]/edits"}
                  as={`/paper/${paper.id}/summary/edits`}
                >
                  <div className={css(styles.action)}>View Edit History</div>
                </Link>
                <div className={css(styles.action)} onClick={this.edit}>
                  <div className={css(styles.pencilIcon)}>
                    <i className="fas fa-pencil"></i>
                  </div>
                  Edit Summary
                </div>
              </div>
            ) : (
              <div className={css(styles.guidelines)}>
                Please review our{" "}
                <a
                  className={css(styles.authorGuidelines)}
                  href="https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
                  target="_blank"
                >
                  Summary Guidelines
                </a>{" "}
                to see how to write for ResearchHub
              </div>
            )}
            {this.state.finishedLoading && (
              <TextEditor
                canEdit={true}
                readOnly={this.state.readOnly}
                canSubmit={true}
                commentEditor={false}
                initialValue={this.state.editorState}
                onSubmit={this.saveEdit}
              />
            )}
          </div>
        ) : (
          <div className={css(styles.container, styles.noSummaryContainer)}>
            {this.state.addSummary ? (
              <div className={css(styles.summaryEdit)}>
                <div className={css(styles.guidelines)}>
                  Please review our{" "}
                  <a
                    className={css(styles.authorGuidelines)}
                    href="https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
                    target="_blank"
                  >
                    Summary Guidelines
                  </a>{" "}
                  to see how to write for ResearchHub
                </div>
                <TextEditor
                  canEdit={true}
                  canSubmit={true}
                  commentEditor={false}
                  onSubmit={this.saveEdit}
                />
              </div>
            ) : (
              <div className={css(styles.box)}>
                <img
                  className={css(styles.img)}
                  src={"/static/icons/sad.png"}
                />
                <h2 className={css(styles.noSummaryTitle)}>
                  A summary hasn't been filled in yet!
                </h2>
                <div className={css(styles.text)}>
                  Please add a summary to this paper
                </div>
                <button
                  className={css(styles.button)}
                  onClick={this.addSummary}
                >
                  Add Summary
                </button>
              </div>
            )}
          </div>
        )}
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
  noSummaryContainer: {
    alignItems: "center",
  },
  guidelines: {
    color: "rgba(36, 31, 58, 0.8)",
    textAlign: "center",
    letterSpacing: 0.7,
    marginBottom: 16,
    width: "100%",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
  },
  text: {
    fontSize: 16,
    color: colors.BLACK(0.8),
  },
  summaryActions: {
    width: 280,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryEdit: {
    marginBottom: 50,
    width: "100%",
  },
  action: {
    color: "#241F3A",
    fontSize: 16,
    opacity: 0.6,
    display: "flex",
    cursor: "pointer",
  },
  button: {
    border: "1px solid",
    borderColor: colors.PURPLE(1),
    padding: "8px 32px",
    background: "#fff",
    color: colors.PURPLE(1),
    marginTop: 24,
    fontSize: 16,
    borderRadius: 4,
    height: 45,
    outline: "none",
    cursor: "pointer",
    ":hover": {
      borderColor: "#FFF",
      color: "#FFF",
      backgroundColor: colors.PURPLE(1),
    },
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

const mapDispatchToProps = {
  getEditHistory: PaperActions.getEditHistory,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryTab);
