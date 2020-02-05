// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";

// Next
import Router from "next/router";

// Redux
import { ModalActions } from "../../redux/modals";
import { PaperActions } from "../../redux/paper";
import { MessageActions } from "../../redux/message";

// Component
import BaseModal from "../modal/BaseModal";
import FormInput from "../Form/FormInput";
import PaperEntry from "../SearchSuggestion/PaperEntry";
import Loader from "../Loader/Loader";
import Button from "../Form/Button";
import DragNDrop from "../Form/DragNDrop";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const TRANSITION_TIME = 300;

class UploadPaperModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      search: "",
      searching: false,
      uploadView: false,
      uploadFinish: false,
      uploading: false,
      selectedPaper: null,
      uploadedPaper: {},
      transition: false,
      papers: [],
      mobileView: false,
    };

    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateDimensions();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if (window.innerWidth < 436) {
      this.setState({
        mobileView: true,
      });
    } else {
      this.setState({
        mobileView: false,
      });
    }
  };

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions, paperActions } = this.props;
    this.setState({
      ...this.initialState,
    });
    paperActions.removePaperFromState();
    this.enableParentScroll();
    modalActions.openUploadPaperModal(false);
  };

  /**
   * handles the query string for author
   * @param { String } value - the value sent up from the FormInput
   */
  handleSearchInput = (id, value) => {
    clearTimeout(this.searchPaperTimeout);

    this.setState({
      search: value,
      searching: value === "" ? false : true,
    });

    this.searchPaperTimeout = setTimeout(() => {
      this.searchTitle(value);
    }, 300);
  };

  /**
   * search user input among paper titles or DOI
   * @param {String} value - the paper title the user is typing
   */
  searchTitle = (value) => {
    fetch(API.PAPER({ search: value }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        this.setState({
          papers: resp.results,
          searching: false,
        });
      });
  };

  /**
   * grabs the appropriate status tex,
   * depending on where the user is in the upload flow
   */
  getStatusText = () => {
    let {
      search,
      searching,
      papers,
      uploadView,
      selectedPaper,
      uploadFinish,
      mobileView,
    } = this.state;

    if (search === "") {
      return `First check to make sure your paper${
        mobileView ? "\n" : " "
      }isn't already on Research Hub`;
    } else if (searching) {
      return "Searching by name and DOI...";
    } else if (papers.length === 0) {
      return "Looks like this paper is not on Research Hub yet.";
    } else if (papers.length > 3) {
      return "Scroll through the results";
    } else if (selectedPaper) {
      return "This paper is on Research Hub!";
    } else if (uploadFinish) {
      return "We’re almost done! Click ‘continue’ to add more information";
    }
  };

  /**
   * toggles the view that allows the user to upload the paper
   * assuming the paper is not found in the search
   */
  toggleUploadView = () => {
    this.setState(
      {
        transition: true,
      },
      () => {
        setTimeout(async () => {
          this.setState(
            {
              uploadView: !this.state.uploadView,
            },
            () => {
              this.setState({ transition: false });
            }
          );
        }, TRANSITION_TIME);
      }
    );
  };
  f;

  /**
   * highlights the paper entry that is chosen by the user
   * @param {Number} index - the index of the paper entry in "papers" array
   */
  handlePaperEntryClick = (index) => {
    this.setState({ selectedPaper: index });
  };

  /**
   * function is called as a callback when a file is dropped
   */
  uploadPaper = (acceptedFiles, binaryStr) => {
    let { paperActions } = this.props;
    let paper = acceptedFiles[0];
    this.setState(
      {
        uploading: true,
      },
      async () => {
        //save paper to redux
        await paperActions.uploadPaperToState(paper);
        setTimeout(() => {
          this.setState({
            // search: grabName(),
            uploading: false,
            uploadFinish: true,
            uploadedPaper: paper,
          });
        }, 300);
      }
    );
  };

  /**
   * function is called as a callback when a pdf url returns successful
   * @param { Object } data - the JSON returned from the backend
   * @param { String } url - the string that the user inputed
   */
  handleUrl = (data, url) => {
    let { csl_item } = data;
    let { id, title } = csl_item;
    if (!id) return;
    let metaData = {};
    metaData = { ...csl_item };
    metaData.name = title;
    metaData.url = url;
    this.setState(
      {
        uploading: true,
      },
      () => {
        setTimeout(() => {
          this.props.paperActions.uploadPaperToState(metaData);
          this.setState({
            uploading: false,
            uploadFinish: true,
            uploadedPaper: metaData,
          });
        }, 300);
      }
    );
  };

  /**
   * resets the state of variables needed for DragNDrop
   * when a user chooses to upload another file
   */
  resetStateToUploadView = async () => {
    let { paperActions } = this.props;
    await paperActions.removePaperFromState();
    this.setState({
      ...this.initialState,
      uploadView: true,
    });
  };

  navigateToPaperUploadInfo = () => {
    if (Object.keys(this.state.uploadedPaper).length < 1) {
      return;
    }
    this.props.messageActions.showMessage({ load: true, show: true });
    let title = this.state.search;
    Router.push({
      pathname: "/paper/upload/info",
      query: { uploadPaperTitle: title },
    });
    this.setState(
      {
        ...this.initialState,
      },
      () => {
        this.enableParentScroll();
        this.props.modalActions.openUploadPaperModal(false);
      }
    );
  };

  /**
   * prevents scrolling of parent component when modal is open
   * & renables scrolling of parent component when modal is closed
   */
  disableParentScroll = () => {
    document.body.style.overflow = "hidden";
  };

  enableParentScroll = () => {
    document.body.style.overflow = "scroll";
  };

  render() {
    let {
      search,
      searching,
      papers,
      uploadedPaper,
      selectedPaper,
      transition,
      uploadView,
      uploading,
      uploadFinish,
      mobileView,
    } = this.state;
    let { modals } = this.props;

    let suggestedPapers = this.state.papers.map((paper, index) => {
      return (
        <PaperEntry
          key={index}
          title={paper.title}
          date={paper.paper_publish_date}
          paperId={paper.id}
          index={index}
          selected={index === selectedPaper}
          closeModal={this.closeModal}
        />
      );
    });
    return (
      <BaseModal
        isOpen={modals.openUploadPaperModal}
        closeModal={this.closeModal}
        onRequestClose={this.closeModal}
        removeDefault={true}
      >
        <div
          className={css(styles.modalContent, transition && styles.transition)}
        >
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
          />
          {uploadView && (
            <div
              className={css(styles.backButtonContainer)}
              onClick={this.toggleUploadView}
            >
              <img
                src={"/static/icons/back-arrow.png"}
                className={css(styles.backButton)}
              />
              Go back to search
            </div>
          )}
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>
              {uploadView ? "Upload your paper" : "Add a Paper to ResearchHub"}
            </div>
            <div className={css(styles.subtitle, styles.text)}>
              {uploadView
                ? "Upload a PDF or paste a URL below"
                : "Papers that are already on our platform don't need to be re-uploaded"}
            </div>
          </div>
          <FormInput
            onChange={this.handleSearchInput}
            value={search}
            label={"Enter a link to a Academic Paper or a DOI"}
            placeholder={"Enter PDF link or DOI"}
            id={"search"}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
          />
          {uploadView ? (
            <div className={css(styles.uploadContainer)}>
              <div className={css(styles.loadingMessage, styles.text)}>
                {uploadFinish &&
                  `We're almost done! ${mobileView ? "\n" : ""} `}
              </div>
              <DragNDrop
                pasteUrl={!uploadFinish}
                handleDrop={this.uploadPaper}
                loading={uploading}
                uploadFinish={uploadFinish}
                uploadedPaper={uploadedPaper}
                url={typeof uploadedPaper.URL === "string"}
                reset={this.resetStateToUploadView}
                handleUrl={this.handleUrl}
              />
            </div>
          ) : (
            <div className={css(styles.searchResultContainer)}>
              <div className={css(styles.loadingMessage, styles.text)}>
                {this.getStatusText()}
              </div>
              <div className={css(styles.searchResults)}>
                {searching ? (
                  <Loader loading={true} />
                ) : (
                  search !== "" && suggestedPapers
                )}
              </div>
            </div>
          )}
          <span className={css(styles.buttonContainer)}>
            <Button
              label={uploadView ? "Continue" : "Continue"}
              customButtonStyle={styles.button}
              customLabelStyle={styles.label}
              disabled={uploadView && !uploadFinish}
              onClick={
                uploadView
                  ? this.navigateToPaperUploadInfo
                  : this.toggleUploadView
              }
            />
          </span>
        </div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    background: "#fff",
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    "@media only screen and (max-width: 665px)": {
      width: "90%",
    },
    "@media only screen and (max-width: 436px)": {
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      transform: "unset",
    },
  },
  modalCloseButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 50,
    transition: "all ease-in-out 0.3s",
    opacity: 1,
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: 426,
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 665px)": {
      fontSize: 21,
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 18,
      width: 338,
      height: "unset",
      textAlign: "center",
      marginTop: 10,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 16,
      width: 270,
    },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
    "@media only screen and (max-width: 665px)": {
      fontSize: 12,
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      width: 338,
      height: "unset",
      textAlign: "center",
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
      width: 270,
    },
  },
  containerStyle: {
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
      marginBottom: 5,
    },
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  inputStyle: {
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  text: {
    fontFamily: "Roboto",
  },
  searchResultContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    overflowY: "auto",
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loader: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  loadingMessage: {
    fontWeight: 400,
    fontSize: 14,
    color: "#4f4d5f",
    marginBottom: 15,
    textAlign: "center",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 11,
      width: 270,
    },
  },
  searchResults: {
    overflowY: "auto",
    width: 526,
    maxHeight: 300,
    paddingTop: 10,
    position: "relative",
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 376px)": {
      paddingTop: 0,
    },
    "@media only screen and (max-width: 321px)": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: 280,
      maxHeight: 130,
    },
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  backButtonContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 20,
    cursor: "pointer",
    fontFamily: "Roboto",
    color: "#a5a4ae",
    fontSize: 14,
    ":hover": {
      color: "#232038",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  backButton: {
    height: 12,
    weight: 16,
    marginRight: 12,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  buttonContainer: {
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      backgroundColor: "#FFF",
      display: "flex",
      justifyContent: "center",
      position: "sticky",
      bottom: 0,
      paddingBottom: 20,
    },
  },
  button: {
    width: 258,
    height: 55,
    // marginTop: 10,
    "@media only screen and (max-width: 321px)": {
      width: 220,
      height: 45,
    },
  },
  label: {
    fontSize: 16,
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  transition: {
    opacity: 0,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  paper: state.paper,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadPaperModal);
