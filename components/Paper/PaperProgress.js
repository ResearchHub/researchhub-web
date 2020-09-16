import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Progress from "react-progressbar";
import "./PaperProgress.css";

import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import Loader from "~/components/Loader/Loader";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";
import { PaperActions } from "~/redux/paper";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import {
  convertToEditorValue,
  convertDeltaToText,
  isQuillDelta,
} from "~/config/utils/";

class PaperProgress extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      loading: true,
      sections: [],
      progress: 0,
      complete: true,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.formatSections();
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paper.id !== this.props.paper.id) {
      return this.setState({ ...this.initialState }, () => {
        this.formatSections();
      });
    } else if (
      prevProps.limitations.limits.length !==
      this.props.limitations.limits.length
    ) {
      return this.formatSections(); // change to another function that handles specific cases // changes small as oppose to large or complete changes
    } else if (
      JSON.stringify(prevProps.bullets.bullets) !==
      JSON.stringify(this.props.bullets.bullets)
    ) {
      return this.formatSections();
    } else if (prevProps.figureCount !== this.props.figureCount) {
      return this.formatSections();
    } else if (prevProps.paper.summary !== this.props.paper.summary) {
      return this.formatSections();
    } else if (prevProps.commentCount !== this.props.commentCount) {
      return this.formatSections();
    } else if (
      prevProps.paper.file !== this.props.paper.file ||
      prevProps.paper.pdf_url !== this.props.paper.pdf_url
    ) {
      return this.formatSections();
    }
  }

  componentWillUnmount() {
    this.setState({ ...this.initialState });
  }

  getSummaryText(summary) {
    if (summary.summary) {
      if (summary.summary_plain_text) {
        return summary.summary_plain_text;
      }
      if (isQuillDelta(summary.summary)) {
        return convertDeltaToText(summary.summary);
      }
      return convertToEditorValue(summary.summary).document.text
        ? convertToEditorValue(summary.summary).document.text
        : "";
    } else {
      return "";
    }
  }

  formatSections = () => {
    let { limitations, bullets, figureCount, commentCount, paper } = this.props;
    let summary = paper.summary && this.getSummaryText(paper.summary);
    let sections = [
      {
        label: "Key Takeaways",
        active: bullets && bullets.bullets && bullets.bullets.length >= 3,
        count: bullets && bullets.bullets && bullets.bullets.length,
      },
      {
        label: "Summary",
        active: summary && summary.trim().length >= 250,
        count: summary ? summary.trim().length : 0,
      },
      {
        label: "Comments",
        active: commentCount > 0,
      },
      {
        label: "Paper PDF",
        active: paper.file ? paper.file : paper.pdf_url ? paper.pdf_url : false,
      },
      {
        label: "Figures",
        active: figureCount > 0,
        optional: true,
      },
      {
        label: "Limitations",
        active:
          limitations && limitations.limits && limitations.limits.length > 0,
        optional: true,
      },
    ];

    let progress = this.calculateProgress(sections);

    this.setState(
      {
        sections,
        progress,
        complete: progress >= 50,
      },
      () => {
        if (this.state.complete && !this.props.showAllSections) {
          this.props.toggleShowAllSections(true);
        } else if (!this.state.complete && this.props.showAllSections) {
          this.props.toggleShowAllSections(false);
        }
        this.state.loading &&
          setTimeout(() => {
            this.setState({ loading: false });
          }, 400);
      }
    );
  };

  trackEvent = (interaction, label) => {
    let user;
    if (this.props.auth.isLoggedIn) {
      user = this.props.auth.user;
    }

    let value = label.toLowerCase();
    let paperId = this.props.paper.id;
    let payload = {
      paper: paperId,
      interaction,
      item: {
        name: "progress",
        value,
      },
      utc: new Date(),
    };

    let ampPayload = {
      event_type: "paper_progress",
      user_id: user ? user.id : null,
      time: +new Date(),
      event_properties: {
        interaction,
        value,
        paper: paperId,
      },
    };

    fetch(API.GOOGLE_ANALYTICS({}), API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {});

    fetch(API.AMP_ANALYTICS, API.POST_CONFIG(ampPayload))
      .then(Helpers.checkStatus)
      .then((res) => {});
  };

  calculateProgress = (sections) => {
    let { bullets, commentCount, paper } = this.props;

    var progress = 0; // there are 4 actives
    sections.forEach((section) => {
      if (section.active) {
        if (section.label === "Key Takeaways") {
          let num = bullets.bullets.length * (33 / 3);
          progress += Math.min(num, 33);
        } else if (section.label === "Summary") {
          let summary = paper.summary && this.getSummaryText(paper.summary);

          if (summary && summary.length >= 250) {
            progress += 34;
          } else {
            progress += (Math.min(250, summary.length) / 250) * 34;
          }
        } else if (section.label === "Paper PDF") {
          if (section.active) {
            progress += 33;
          }
        } else if (
          section.label === "Figures" ||
          section.label === "Limitations"
        ) {
          if (section.active) {
            progress += 2;
          }
        } else if (section.label === "Comments") {
          let num = commentCount * 2;
          progress += Math.min(num, 4);
        }
      } else {
        if (section.label === "Key Takeaways") {
          let num = bullets.bullets.length * (33 / 3);
          progress += Math.min(num, 33);
        } else if (section.label === "Summary") {
          let summary = paper.summary && this.getSummaryText(paper.summary);

          if (summary && summary.length >= 250) {
            progress += 34;
          } else {
            progress +=
              (Math.min(250, summary ? summary.length : 0) / 250) * 34;
          }
        }
      }
    });

    return Math.min(Math.round(progress), 100);
  };

  postFigures = (figures, callback) => {
    let { showMessage, setMessage, paperId } = this.props;
    showMessage({ load: true, show: true });

    let params = new FormData();
    figures.forEach((figure, i) => {
      params.append(`figure${i}`, figure);
    });
    params.append("paper", paperId);
    params.append("figure_type", "FIGURE");

    return fetch(
      API.ADD_FIGURE({ paperId, progress: true }),
      API.POST_FILE_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showMessage({ show: false });
        setMessage("Figure uploaded successfully");
        showMessage({ show: true });
        let paperFigures = this.props.paper.figures
          ? this.props.paper.figures
          : [];
        let newFigures = [...paperFigures, ...res.files];
        this.props.updatePaperState("figures", newFigures);
        this.props.setFigureCount(newFigures.length);
        callback();
      })
      .catch((err) => {
        if (err.response.status == 429) {
          showMessage({ show: false });
          callback();
          return this.props.openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  openPaperFeatureModal = (section) => {
    if (section.active) {
      return;
    }

    let label = section.label;
    this.trackEvent("click", section.label);
    if (label === "Figures") {
      return this.props.openDndModal(true, {
        title: "Add Figures",
        subtitle: "Upload up to 3 figures at a time",
        fileAccept: "image/x-png,image/jpeg",
        onSubmit: this.postFigures,
      });
    }

    let props = {
      tab:
        label &&
        label
          .toLowerCase()
          .split(" ")
          .join("-"),
    };

    if (label === "Limitations") {
      props.setLimitCount = this.props.setLimitCount;
    }

    if (label === "Comments") {
      let commentProps = {
        commentCount: this.props.commentCount,
        setCount: this.props.setCount,
        threads: this.props.threads,
        setDiscussionThreads: this.props.setDiscussionThreads,
      };
      props = { ...props, ...commentProps };
    }

    this.props.openPaperFeatureModal(true, props);
  };

  renderMainText = () => {
    let sections = this.state.sections.filter((section) => !section.active);

    if (sections.length > 0) {
      let section = sections[0];
      let paper = this.props.paper;
      let summary = paper.summary && this.getSummaryText(paper.summary);
      if (section.label === "Summary" && summary) {
        if (summary.length > 0) {
          return (
            <Fragment>
              to the{" "}
              <span
                className={css(styles.sectionLink)}
                onClick={() => this.openPaperFeatureModal(section)}
              >
                {`${section.label}.`}
              </span>
            </Fragment>
          );
        }
      }
      return (
        <span
          className={css(styles.sectionLink)}
          onClick={() => this.openPaperFeatureModal(section)}
        >
          {`${section.label}.`}
        </span>
      );
    } else {
      return null;
    }
  };

  renderItems = (start = 0, end) => {
    let { loading, sections } = this.state;

    return sections.slice(start, end).map((section, i) => {
      return (
        <PermissionNotificationWrapper
          modalMessage="to add to paper page"
          onClick={() => this.openPaperFeatureModal(section)}
          permissionKey="ProposeSummaryEdit"
          loginRequired={true}
          key={`paper${this.props.paper.id}-progress-${i}`}
        >
          <div
            className={css(
              styles.section,
              section.active && !loading & styles.sectionActive
            )}
          >
            <div
              className={css(
                styles.sectionIcon,
                section.active && !loading && styles.iconActive
              )}
              id="icon"
            >
              {section.active && !loading ? (
                icons.checkCircle
              ) : (
                <i className="fal fa-plus-circle"></i>
              )}
            </div>
            {section.label}
            {!!section.count && ":"}
            {!!section.count && (
              <span className={css(styles.count)}>
                {section.label === "Summary"
                  ? `${Math.min(section.count, 250)}/250 chars`
                  : `${Math.min(section.count, 3)}/3`}
              </span>
            )}
          </div>
        </PermissionNotificationWrapper>
      );
    });
  };

  render() {
    return (
      <div
        className={css(
          styles.container,
          this.state.complete && styles.completed
        )}
      >
        <div className={css(styles.column, styles.left)}>
          <div className={css(styles.maintext)}>
            {!this.state.loading && !this.state.complete ? (
              <Fragment>
                <h3 className={css(styles.title)}>
                  {`Help us add more details to this page`}
                </h3>
                <div className={css(styles.passengerText)}>
                  Please help us improve this paper by adding{" "}
                  {this.renderMainText()}
                </div>
                <div className={css(styles.imageContainer)}>
                  <img
                    className={css(styles.image)}
                    src={"/static/background/homepage-empty-state.png"}
                  />
                </div>
              </Fragment>
            ) : null}
          </div>
        </div>
        <div className={css(styles.column, styles.right)}>
          <div className={css(styles.progressBar)}>
            <Progress
              completed={this.state.loading ? 0 : this.state.progress}
            />
            <div className={css(styles.percentage)}>
              {this.state.loading ? (
                <Loader loading={true} size={13} color={"#FFF"} />
              ) : (
                `${this.state.progress}%`
              )}
            </div>
          </div>
          <div className={css(styles.row)}>
            <div className={css(styles.sectionColumn)}>
              {this.renderItems(0, 3)}
            </div>
            <div
              className={css(styles.sectionColumn, styles.sectionColumnRight)}
            >
              {this.renderItems(3)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: 50,
    backgroundColor: "#FFF",
    minHeight: 80,
    boxSizing: "border-box",
    border: "1.5px solid",
    borderColor: "rgb(240, 240, 240)",
    marginBottom: 30,
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 3px 4px",
    borderTop: "none",
    borderRadius: 4,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 661px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  completed: {
    display: "none",
  },
  wrapper: {
    width: "75%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    color: "rgb(36, 31, 58)",
    fontWeight: 500,
    marginTop: 0,
    marginBottom: 15,
    "@media only screen and (min-width: 425px)": {
      fontSize: 22,
    },
  },
  passengerText: {
    "@media only screen and (max-width: 661px)": {
      marginBottom: 5,
    },
  },
  maintext: {
    color: "#5a566a",
    minHeight: 36,
    "@media only screen and (max-width: 800px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      marginTop: 10,
    },
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 16,
    "@media only screen and (max-width: 661px)": {
      display: "none",
    },
  },
  image: {
    height: 120,
  },
  progressContainer: {},
  progressBar: {
    width: "100%",
    marginBottom: 20,
    boxSizing: "border-box",
    height: 20,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#e3e3e7",
    position: "relative",
  },
  percentage: {
    position: "absolute",
    color: "#FFF",
    top: "50%",
    right: "50%",
    transform: "translate(50%,-50%)",
    // fontWeight: 'bold',
    textShadow: "1px 1px 4px #000",
    fontSize: 16,
  },
  section: {
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#848290",
    ":hover": {
      color: colors.BLACK(),
    },
    marginBottom: 16,
    "@media only screen and (max-width: 800px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  sectionActive: {
    color: "#5a566a",
  },
  sectionIcon: {
    color: "#D0D0D0",
    marginRight: 10,
    fontSize: 25,
    "@media only screen and (max-width: 800px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 15,
    },
  },
  sectionLink: {
    cursor: "pointer",
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  iconActive: {
    color: colors.BLUE(),
  },
  left: {
    width: "50%",
    "@media only screen and (max-width: 767px)": {
      width: "50%",
    },
    "@media only screen and (max-width: 661px)": {
      width: "100%",
    },
  },
  right: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    paddingLeft: 15,
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      width: "50%",
    },
    "@media only screen and (max-width: 661px)": {
      width: "100%",
      paddingLeft: 0,
    },
  },
  sectionColumn: {
    width: "65%",
  },
  sectionColumnRight: {
    width: "35%",
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
  },
  count: {
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  limitations: state.limitations,
  bullets: state.bullets,
  paper: state.paper,
  figures: state.paper.figures,
  paperId: state.paper.id,
  auth: state.auth,
});

const mapDispatchToProps = {
  openPaperFeatureModal: ModalActions.openPaperFeatureModal,
  openDndModal: ModalActions.openDndModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  updatePaperState: PaperActions.updatePaperState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperProgress);
