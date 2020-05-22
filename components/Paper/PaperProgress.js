import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Progress from "react-progressbar";
import "./PaperProgress.css";
import { isAndroid, isMobile } from "react-device-detect";
var isAndroidJS = false;
if (process.browser) {
  const ua = navigator.userAgent.toLowerCase();
  isAndroidJS = ua && ua.indexOf("android") > -1;
}

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

class PaperProgress extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      loading: true,
      sections: [],
      progress: 0,
      complete: false,
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
    }
  }

  componentWillUnmount() {
    this.setState({ ...this.initialState });
  }

  formatSections = () => {
    let { limitations, bullets, figureCount, paper } = this.props;
    let sections = [];

    let list = [
      {
        label: "Key Takeaways",
        active: bullets && bullets.bullets && bullets.bullets.length > 0,
      },
      {
        label: "Summary",
        active: paper && paper.summary ? true : false,
      },
      {
        label: "Figures",
        active: figureCount > 0,
      },
      {
        label: "Limitations",
        active:
          limitations && limitations.limits && limitations.limits.length > 0,
      },
    ];

    this.setState(
      {
        sections: list,
        progress: (list.filter((el) => el.active).length / 4) * 100,
        complete: (list.filter((el) => el.active).length / 4) * 100 === 100,
      },
      () => {
        this.state.loading &&
          setTimeout(() => {
            this.setState({ loading: false });
          }, 400);
      }
    );
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

    return fetch(API.ADD_FIGURE({ paperId }), API.POST_FILE_CONFIG(params))
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

    if (label === "Figures") {
      return this.props.openDndModal(true, {
        title: "Add Figures",
        subtitle: "Upload up to 3 figures at a time",
        fileAccept: "image/x-png,image/jpeg",
        onSubmit: this.postFigures,
      });
    }
    if (label === "Summary") {
      if ((isAndroid || isAndroidJS) && isMobile) {
        this.props.setMessage("Edit the summary on Desktop");
        return this.props.showMessage({ show: true });
      }
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
    this.props.openPaperFeatureModal(true, props);
  };

  renderMainText = () => {
    let sections = this.state.sections.filter((section) => !section.active);

    if (sections.length > 0) {
      let section = sections[0];
      return (
        <span
          className={css(styles.sectionLink)}
          onClick={() => this.openPaperFeatureModal(section.label)}
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
        >
          <div
            className={css(
              styles.section,
              section.active && !loading & styles.sectionActive
            )}
            key={`paper${this.props.paper.id}-progress-${i}`}
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
                <i class="fal fa-plus-circle"></i>
              )}
            </div>
            {section.label}
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
                {`This Paper is missing information. Please help us improve this paper by adding `}
                {this.renderMainText()}
              </Fragment>
            ) : null}
          </div>
          <div className={css(styles.imageContainer)}>
            <img
              className={css(styles.image)}
              src={"/static/background/homepage-empty-state.png"}
            />
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
              {this.renderItems(0, 2)}
            </div>
            <div className={css(styles.sectionColumn)}>
              {this.renderItems(2)}
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
    padding: "20px 40px",
    backgroundColor: "#FAFAFD",
    minHeight: 80,
    boxSizing: "border-box",
    border: "1px solid",
    borderColor: "#E7E7E7",
    marginTop: -30,
    marginBottom: 30,
    borderTop: "none",
    backgroundColor: "#FFF",
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
  maintext: {
    fontSize: 15,
    color: "#5a566a",
    marginBottom: 15,
    fontWeight: 500,
    minHeight: 36,
    "@media only screen and (max-width: 800px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 661px)": {
      textAlign: "center",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      marginTop: 10,
    },
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 80,
    "@media only screen and (max-width: 661px)": {
      display: "none",
    },
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
    fontSize: 15,
  },
  section: {
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#848290",
    ":hover": {
      color: colors.BLACK(),
    },
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
    color: colors.GREEN(),
  },
  left: {
    width: "60%",
    "@media only screen and (max-width: 767px)": {
      width: "50%",
    },
    "@media only screen and (max-width: 661px)": {
      width: "100%",
    },
  },
  right: {
    width: "40%",
    display: "flex",
    justifyContent: "space-between",
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
    width: "50%",
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
});

const mapStateToProps = (state) => ({
  limitations: state.limitations,
  bullets: state.bullets,
  paper: state.paper,
  figures: state.paper.figures,
  paperId: state.paper.id,
});

const mapDispatchToProps = {
  openPaperFeatureModal: ModalActions.openPaperFeatureModal,
  openDndModal: ModalActions.openDndModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  updatePaperState: PaperActions.updatePaperState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperProgress);
