import Link from "next/link";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Plain from "slate-plain-serializer";
import { isMobile } from "react-device-detect";
import Ripples from "react-ripples";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import Head from "~/components/Head";
import TextEditor from "~/components/TextEditor";

// Redux
import { PaperActions } from "~/redux/paper";

// Config
import { convertToEditorValue } from "~/config/utils";
import icons from "~/config/themes/icons";
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

    const emptyState = Plain.deserialize("");

    this.state = {
      selectedEdit: 0,
      activeEdit: 0,
      editorState: emptyState,
      finishedLoading: false,
      transition: false,
    };
  }

  changeEditView = (selectedIndex, edit) => {
    let editorState = convertToEditorValue(edit.summary);

    this.setState({ transition: true }, () => {
      // transition is needed for Quill to update content
      this.setState(
        {
          selectedEdit: selectedIndex,
          editorState,
          transition: false,
        },
        () => {
          console.log("STATE", this.state);
        }
      );
    });
  };

  componentDidMount() {
    if (this.props.paper.editHistory.length > 0) {
      let edit = this.props.paper.editHistory[0];
      let editorState = convertToEditorValue(edit.summary);

      this.setState({
        editorState,
      });
    }
  }

  saveAsMainSummary = (index, summary) => {
    const payload = { summary_id: summary.id };
    // let paperId = this.props.paper.id;
    console.log("this.props.ppaper", this.props.paper);
    fetch(API.PAPER({ paperId: this.props.paper.id }), API.PUT_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        console.log("res", res);
        this.setState({ activeEdit: index });
        // update paper
      });
  };

  setRef = (editor) => {
    this.editor = editor;
    console.log("editor", editor);
  };

  render() {
    let { paper, router } = this.props;
    let editHistory = paper.editHistory.map((edit, index) => {
      console.log("edit", edit);
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
            {moment(edit.approvedDate).format("MMM Do YYYY, h:mm A")}

            {/* {index === 0 && <span>{` (Current Ver.)`}</span>} */}
            <span
              className={css(
                styles.starIcon,
                this.state.activeEdit === index && styles.activeSummary
              )}
              onClick={() => this.saveAsMainSummary(index, edit)}
            >
              {icons.starFilled}
            </span>
          </div>
          <div className={css(styles.user)}>
            {`${edit.proposedBy.firstName} ${edit.proposedBy.lastName}`}
          </div>
        </div>
      );
    });
    return (
      <ComponentWrapper>
        <Head
          title={this.props.paper && this.props.paper.title}
          description={
            this.props.paper &&
            `Add information about ${this.props.paper.title}`
          }
          socialImageUrl={this.props.paper && this.props.paper.metatagImage}
        />
        <div
          className={css(styles.container, isMobile && styles.mobileContainer)}
        >
          {isMobile && (
            <div className={css(styles.edits, styles.mobileEdits)}>
              <div className={css(styles.editHistoryContainer)}>
                <div className={css(styles.revisionTitle)}>
                  Revision History
                </div>
                {editHistory}
              </div>
            </div>
          )}
          <Link
            href={"/paper/[paperId]/[tabName]"}
            as={`/paper/${router.query.paperId}/summary`}
          >
            <div className={css(styles.back)}>
              <i className={css(styles.arrow) + " fal fa-long-arrow-left"}></i>
              Summary
            </div>
          </Link>
          <div className={css(styles.editor, isMobile && styles.mobileEditor)}>
            <h1> {paper.title} </h1>
            {!this.state.transition && (
              <TextEditor
                canEdit={false}
                readOnly={true}
                containerStyles={styles.editorContainer}
                canSubmit={false}
                commentEditor={false}
                passedValue={this.state.editorState}
                initialValue={this.state.editorState}
                s
                setRef={this.setRef}
              />
            )}
          </div>
          {!isMobile && (
            <div className={css(styles.edits)}>
              <div className={css(styles.editHistoryContainer)}>
                <div className={css(styles.revisionTitle)}>
                  Revision History
                </div>
                {editHistory}
              </div>
            </div>
          )}
        </div>
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  container: {
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
  editorContainer: {
    marginLeft: -16,
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
  editor: {
    paddingTop: 75,
    width: "100%",
  },
  edits: {
    paddingTop: 75,
  },
  editHistoryContainer: {
    background: "#F9F9FC",
    minHeight: 200,
    borderRadius: 4,
  },
  selectedEdit: {
    background: "#F0F1F7",
  },
  editHistoryCard: {
    width: 250,
    padding: "14px 30px",
    cursor: "pointer",
    ":hover": {
      background: "#F0F1F7",
    },
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
    padding: "20px 30px",
    color: "#241F3A",
    fontSize: 12,
    opacity: 0.4,
    letterSpacing: 1.2,

    textTransform: "uppercase",
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
  },
  arrow: {
    marginRight: 8,
  },
  mobileContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  mobileEditor: {
    paddingTop: 20,
  },
  mobileEdits: {
    width: 310,
  },
  starIcon: {
    color: colors.YELLOW(0.4),
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

export default connect(mapStateToProps)(withRouter(PaperEditHistory));
