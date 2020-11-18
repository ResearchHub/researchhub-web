import { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Carousel from "nuka-carousel";
import FsLightbox from "fslightbox-react";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";
import { withAlert } from "react-alert";
import { isMobile } from "react-device-detect";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyState from "~/components/Placeholders/EmptyState";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";

import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import { PaperActions } from "~/redux/paper";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

class FigureTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      figures: this.props.figures ? this.props.figures : [],
      currentSlideIndex: 0,
      fetching: true,
      file: null,
      // Pending Submission
      inputView: false,
      pendingSubmission: false,
      hovered: false,
    };
  }

  componentDidMount() {
    this.setState({ fetching: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paperId !== this.props.paperId) {
      this.setState({ figures: this.props.figures, fetching: false });
    } else if (
      JSON.stringify(prevProps.figures) !== JSON.stringify(this.props.figures)
    ) {
      this.setState({ figures: this.props.figures, fetching: false });
    }
  }

  fetchFigures = () => {
    this.setState({ fetching: true }, () => {
      let paperId = this.props.paperId;
      return fetch(API.GET_PAPER_FIGURES_ONLY({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          this.setState({
            figures: res.data,
          });
          this.props.setFigureCount(res.data.length);
          this.props.updatePaperState("figures", res.data);
          this.setState({ fetching: false });
        });
    });
  };

  setCurrentSlideIndex = (currentSlideIndex) => {
    this.setState({ currentSlideIndex });
  };

  toggleLightbox = () => {
    this.setState({ toggleLightbox: !this.state.toggleLightbox });
  };

  openDndModal = () => {
    let { openDndModal } = this.props;
    let props = {
      title: "Add Figures",
      subtitle: "Upload up to 3 figures at a time",
      accept: "image/x-png,image/jpeg",
      onSubmit: this.postFigures,
    };
    openDndModal(true, props);
  };

  handleFileInput = (e) => {
    if (e.target.files.length === 0) return;
    this.setState({ fetching: true }, () => {
      let file = e.target.files && e.target.files[0]; // we grab the first file
      let reader = new FileReader();

      reader.onload = (event) => {
        this.setState({ inputView: true, fetching: false, file }, () => {
          document.getElementById("preview").src = event.target.result;
        });
      };

      reader.readAsDataURL(file);
    });
  };

  setHovered = (state) => {
    this.state.hovered !== state && this.setState({ hovered: state });
  };

  resetState = () => {
    this.setState(
      {
        inputView: false,
        file: null,
      },
      () => {
        this.figureInput.current.value = null;
      }
    );
  };

  postFigures = (figures, callback) => {
    let { showMessage, setMessage, paperId } = this.props;
    showMessage({ load: true, show: true });
    this.setState({ pendingSubmission: true });

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
        this.setState(
          {
            figures: [...this.state.figures, ...res.files],
            file: null,
            currentSlideIndex: this.state.figures.length - 1,
            pendingSubmission: false,
          },
          () => {
            this.props.updatePaperState("figures", [
              ...this.state.figures,
              ...res.files,
            ]);
            this.props.setFigureCount(this.state.figures.length);
            callback();
            setTimeout(() => {
              this.setState({
                currentSlideIndex: this.state.figures.length - 1,
              });
            }, 1000);
          }
        );
      })
      .catch((err) => {
        if (err.response.status === 429) {
          showMessage({ show: false });
          callback();
          this.props.openRecaptchaPrompt(true);
          return this.setState({
            pendingSubmission: false,
          });
        }
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
        this.setState({
          pendingSubmission: false,
        });
      });
  };

  confirmRemove = (figure, index) => {
    this.props.alert.show({
      text: `Remove Figure ${index + 1} from this paper?`,
      buttonText: "Yes",
      onClick: () => {
        this.removeFigure(figure, index);
      },
    });
  };

  removeFigure = (figure, index) => {
    let { showMessage, setMessage } = this.props;
    showMessage({ show: true, load: true });
    let figureId = figure.id;
    return fetch(API.DELETE_FIGURE({ figureId }), API.DELETE_CONFIG())
      .then(Helpers.checkStatus)
      .then((res) => {
        showMessage({ show: false });
        setMessage("Figure successfully removed!");
        let newFigures = [...this.state.figures];
        newFigures.splice(index, 1);
        this.setState({ figures: newFigures });
        this.props.setFigureCount(newFigures.length);
        showMessage({ show: true });
      })
      .catch((err) => {
        if (err.response.status === 429) {
          showMessage({ show: false });
          return this.props.openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong.");
        showMessage({ show: true, error: true });
      });
  };

  renderButton = (onClick, label) => {
    return (
      <div
        className={css(styles.button, this.state.hovered && styles.show)}
        onClick={(e) => {
          e && e.stopPropagation();
          onClick(e);
        }}
      >
        {label && label}
      </div>
    );
  };

  renderContent = () => {
    let { figures, inputView, pendingSubmission } = this.state;
    if (!figures.length) {
      return (
        <EmptyState
          text={"No Figures Found"}
          icon={<i className="fad fa-image"></i>}
          subtext={"No figures have been found in this paper's PDF"}
        />
      );
    } else if (!inputView) {
      return (
        <Fragment>
          <div className={css(styles.figures)} onClick={this.toggleLightbox}>
            <Carousel
              outline={"none"}
              wrapAround={true}
              className={css(styles.slider)}
              enableKeyboardControls={true}
              afterSlide={(slide) => this.setCurrentSlideIndex(slide)}
              slideIndex={this.state.currentSlideIndex}
              renderBottomCenterControls={() => null}
              renderCenterLeftControls={(arg) => {
                let { previousSlide } = arg;
                return this.renderButton(previousSlide, "Prev");
              }}
              renderCenterRightControls={(arg) => {
                let { nextSlide } = arg;
                return this.renderButton(nextSlide, "Next");
              }}
            >
              {this.state.figures.map((figure) => {
                return <img src={figure.file} className={css(styles.image)} />;
              })}
            </Carousel>
          </div>
          <div className={css(styles.slideIndex)}>
            {`Figure ${this.state.currentSlideIndex + 1} `}
          </div>
        </Fragment>
      );
    }
  };

  render() {
    return (
      <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
        <div
          className={css(styles.container)}
          id="figures-tab"
          onMouseEnter={() => this.setHovered(true)}
          onMouseLeave={() => this.setHovered(false)}
        >
          <div className={css(styles.header)}>
            <div className={css(styles.sectionTitle)}>
              Figures
              <span className={css(styles.count)}>
                {this.state.figures.length}
              </span>
            </div>
            <div className={css(styles.headerRow)}>
              <Ripples
                className={css(styles.item)}
                onClick={() =>
                  this.confirmRemove(
                    this.state.figures[this.state.currentSlideIndex],
                    this.state.currentSlideIndex
                  )
                }
              >
                <span className={css(styles.dropdownItemIcon)}>
                  <i className="fal fa-minus-circle" />
                </span>
                Remove Figure
              </Ripples>
              <Ripples
                className={css(styles.item, styles.right)}
                onClick={this.openDndModal}
              >
                <span className={css(styles.dropdownItemIcon)}>
                  {icons.plusCircle}
                </span>
                Add Figure
              </Ripples>
            </div>
          </div>
          <div className={css(styles.figuresWrapper)}>
            {this.state.figures.length > 0 && (
              <FsLightbox
                toggler={this.state.toggleLightbox}
                type="image"
                sources={this.state.figures.map((figure) => figure.file)}
                slide={this.state.slideIndex}
              />
            )}
            {this.state.fetching ? (
              <div className={css(styles.figures)}>
                <div className={css(styles.image)}>
                  <ReactPlaceholder
                    ready={false}
                    showLoadingAnimation
                    customPlaceholder={<PreviewPlaceholder color="#efefef" />}
                  />
                </div>
              </div>
            ) : (
              this.renderContent()
            )}
          </div>
        </div>
      </ComponentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  componentWrapperStyles: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    transition: "all ease-in-out 0.2s",
  },
  container: {
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 32,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  slider: {
    outline: "none",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 500,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  count: {
    color: "rgba(36, 31, 58, 0.5)",
    fontSize: 17,
    fontWeight: 500,
    marginLeft: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  figuresWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  figures: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    border: "none",
    border: 0,
    maxHeight: 500,
  },
  image: {
    width: 300,
    height: "100%",
    maxHeight: 500,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    outline: "none",
    border: "none",
    objectFit: "contain",
    "@media only screen and (max-width: 415px)": {
      width: 180,
    },
    "@media only screen and (max-width: 320px)": {
      width: 150,
    },
  },
  bottomControl: {
    background: "rgba(36, 31, 58, 0.65)",
    borderRadius: 230,
    height: 30,
    minWidth: 85,
    whiteSpace: "nowrap",
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    transition: "all ease-out 0.3s",
  },
  slideIndex: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    cursor: "pointer",
    fontSize: 14,
    padding: "10px 16px",
    color: "#FFF",
    border: `1px solid ${colors.BLUE()}`,
    backgroundColor: colors.BLUE(),
    borderRadius: 4,
    userSelect: "none",
    opacity: 0,
    transition: "all ease-out 0.2s",
    ":hover": {
      backgroundColor: "#3E43E8",
      color: "#FFF",
    },
    "@media only screen and (max-width: 1024px)": {
      opacity: 1,
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      padding: "5px 8px",
    },
  },
  show: {
    opacity: 1,
  },
  item: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    color: colors.BLACK(),
    cursor: "pointer",
    opacity: 0.6,
    fontSize: 14,
    padding: 8,
    paddingRight: 0,
    ":hover": {
      color: colors.PURPLE(),
      textDecoration: "underline",
      opacity: 1,
    },

    "@media only screen and (max-width: 767px)": {
      padding: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  right: {
    marginLeft: 16,
  },
  headerRow: {
    display: "flex",
    justifyContent: "flex-end",
    "@media only screen and (max-width: 767px)": {
      marginTop: 10,
    },
  },
  dropdownItemIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  inputButton: {
    border: "none",
    outline: "none",
    highlight: "none",
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      color: "#3971FF",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  disabled: {
    opacity: "0.4",
  },
});

const mapStateToProps = (state) => ({
  // figures: state.paper.figures,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  openDndModal: ModalActions.openDndModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  updatePaperState: PaperActions.updatePaperState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(FigureTab));
