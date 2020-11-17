import Link from "next/link";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import Head from "~/components/Head";
import TextEditor from "~/components/TextEditor";
import SummaryEditCard from "~/components/Paper/Tabs/Summary/SummaryEditCard";
import Loader from "~/components/Loader/Loader";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";

// Config
import { convertToEditorValue } from "~/config/utils";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class PaperEditHistory extends React.Component {
  static async getInitialProps({ store, isServer, query }) {
    await store.dispatch(PaperActions.getEditHistory(query.paperId));
    await store.dispatch(PaperActions.getPaper(query.paperId));
    const paper = store.getState().paper;

    return { isServer, paper };
  }
  constructor(props) {
    super(props);

    this.state = {
      selectedEdit: 0,
      activeEdit: 0,
      editorState: null,
      finishedLoading: false,
      transition: false,
      loadMore: false,
    };
  }

  changeEditView = (selectedIndex, edit) => {
    let editorState = convertToEditorValue(edit.summary);

    this.setState({ transition: true }, () => {
      // transition is needed for Quill to update content
      this.setState({
        selectedEdit: selectedIndex,
        editorState,
        transition: false,
      });
    });
  };

  componentDidMount() {
    if (this.props.paper.editHistory.results.length > 0) {
      let activeIndex = 0;
      let edit;

      this.props.paper.editHistory.results.forEach((summary, i) => {
        if (this.props.paper.summary.id === summary.id) {
          edit = summary;
          activeIndex = i;
          return true;
        }
      });

      let editorState = edit && convertToEditorValue(edit.summary);

      this.setState({
        editorState,
        activeEdit: activeIndex,
        selectedEdit: activeIndex,
        finishedLoading: true,
      });
    }
  }

  loadMore = async () => {
    if (this.props.paper.editHistory.next) {
      this.setState({ loadMore: true });
      await this.props.getEditHistory(this.props.paper.id, true);
      this.setState({ loadMore: false });
    }
  };

  saveAsMainSummary = (index, summary, callback) => {
    const { setMessage, showMessage, paper, updatePaperState } = this.props;
    const payload = { summary_id: summary.id };
    const activeEdit = this.state.activeEdit;

    this.setState({ activeEdit: index });

    fetch(API.PAPER({ paperId: paper.id }), API.PUT_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        updatePaperState("summary", summary);
        showMessage({ show: false });
        setMessage("Summary succesfully updated!");
        showMessage({ show: true });
        callback();
      })
      .catch((err) => {
        this.setState({ activeEdit });
        showMessage({ show: false });
        setMessage("Something went wrong. Please try again.");
        showMessage({ show: true, error: true });
      });
  };

  renderSummaryRevisions = (mobile) => {
    let { paper } = this.props;

    let editHistory = paper.editHistory.results.map((edit, index) => {
      return (
        <SummaryEditCard
          key={`edit_history_${index}`}
          selected={this.state.selectedEdit === index}
          active={this.state.activeEdit === index}
          onClick={() => this.changeEditView(index, edit)}
          onSetAsMain={(callback) =>
            this.saveAsMainSummary(index, edit, callback)
          }
          summary={edit}
        />
      );
    });

    return (
      <div className={css(styles.edits, mobile && styles.mobileEdits)}>
        <div className={css(styles.editHistoryContainer)}>
          <div className={css(styles.revisionTitle)}>
            Revision History
            <span className={css(styles.count)}>{paper.editHistory.count}</span>
          </div>
          <div className={css(styles.list)}>
            {editHistory}
            {paper.editHistory.next && (
              <div className={css(styles.loadButton)} onClick={this.loadMore}>
                {this.state.loadMore ? (
                  <Loader loading={true} color={"#FFF"} size={16} />
                ) : (
                  "Load More"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { paper, router } = this.props;

    return (
      <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
        <Head
          title={this.props.paper && this.props.paper.title}
          description={
            this.props.paper &&
            `Add information about ${this.props.paper.title}`
          }
          socialImageUrl={this.props.paper && this.props.paper.metatagImage}
        />
        <div className={css(styles.container)}>
          <Link
            href={"/paper/[paperId]/[paperName]"}
            as={`/paper/${router.query.paperId}/${router.query.paperName}#summary`}
          >
            <div className={css(styles.back)}>
              <i className={css(styles.arrow) + " fal fa-long-arrow-left"}></i>
              Summary
            </div>
          </Link>
          <div className={css(styles.editor)}>
            <h1 className={css(styles.title)}> {paper.title} </h1>
            {this.renderSummaryRevisions(true)}
            {!this.state.transition && (
              <TextEditor
                canEdit={false}
                readOnly={true}
                containerStyles={styles.editorContainer}
                commentStyles={styles.textStyles}
                canSubmit={false}
                commentEditor={false}
                passedValue={this.state.editorState}
                initialValue={this.state.editorState}
              />
            )}
          </div>
          {this.renderSummaryRevisions()}
        </div>
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  componentWrapperStyles: {
    position: "relative",
  },
  container: {
    display: "flex",
    boxSizing: "border-box",
    position: "relative",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "center",
    },
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
  editHistoryContainer: {
    background: "#F9F9FC",
    borderRadius: 4,
    position: "relative",
  },
  list: {
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.24)",
    maxHeight: 600,
    overflowY: "scroll",
    "@media only screen and (max-width: 767px)": {
      maxHeight: 300,
    },
  },
  loadButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    padding: 15,
    background: colors.BLUE(),
    color: "#FFF",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  editorContainer: {
    marginLeft: -16,
    paddingBottom: 30,
    "@media only screen and (max-width: 767px)": {
      margin: 0,
    },
  },
  textStyles: {
    fontSize: 16,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
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
  title: {
    "@media only screen and (max-width: 767px)": {
      fontSize: 22,
    },
  },
  editor: {
    paddingTop: 75,
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      paddingTop: 60,
    },
  },
  mobileEditor: {},
  edits: {
    marginTop: 75,
    marginBottom: 20,
    borderRadius: 4,
    border: "1px solid #F0F1F7",
    borderRadius: 5,
    height: "min-content",
    position: "sticky",
    top: 100,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobileEdits: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      margin: "25px 0",
      boxShadow: "none",
      position: "unset",
    },
  },

  revisionTitle: {
    padding: "20px 15px",
    color: colors.BLACK(0.6),
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    borderBottom: "1.5px solid #F0F1F7",
    background: "#F9F9FC",
    boxShadow: "0 4px 41px -24px rgba(0,0,0,0.16)",
    // position: "sticky",
    // top: 0,
    // zIndex: 2,
    "@media only screen and (max-width: 767px)": {
      // fontSize: 14,
    },
  },
  count: {
    marginLeft: 10,
    color: colors.BLACK(),
  },
  back: {
    display: "flex",
    opacity: 0.4,
    alignItems: "center",
    height: 30,
    paddingTop: 10,
    position: "absolute",
    left: 0,
    top: 16,
    cursor: "pointer",
    ":hover": {
      opacity: 1,
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
  },
  arrow: {
    marginRight: 8,
  },
  mobileContainer: {
    flexDirection: "column",
    alignItems: "center",
  },

  starIcon: {
    color: colors.YELLOW(0.4),
    borderRadius: "50%",
    cursor: "pointer",
    marginLeft: 10,
    ":hover": {
      color: colors.YELLOW(1),
    },
  },
  activeSummary: {
    color: colors.YELLOW(1),
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
});

const mapDispatchToProps = {
  updatePaperState: PaperActions.updatePaperState,
  getEditHistory: PaperActions.getEditHistory,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaperEditHistory));
