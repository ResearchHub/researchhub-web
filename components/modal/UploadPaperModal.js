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

// Component
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
    };

    this.state = {
      ...this.initialState,
    };
  }

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions, paperActions } = this.props;
    this.setState({
      ...this.initialState,
    });
    paperActions.removePaperFromState();
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
    }, 1000);
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
    } = this.state;

    if (search === "") {
      return "Type to start search";
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
    let name = this.state.search;
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
      <Modal
        isOpen={modals.openUploadPaperModal}
        closeModal={this.closeModal}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        className={css(styles.modal)}
        style={overlayStyles}
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
              {uploadView
                ? "Upload your paper"
                : "Enter the title or the DOI of the paper"}
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
            label={"Paper Title"}
            placeholder={"Enter paper title or DOI"}
            id={"search"}
          />
          {uploadView ? (
            <div className={css(styles.uploadContainer)}>
              <div className={css(styles.loadingMessage, styles.text)}>
                {uploadFinish &&
                  "We're almost done! Click 'continue' to add more information"}
              </div>
              <DragNDrop
                pasteUrl={!uploadFinish}
                handleDrop={this.uploadPaper}
                loading={uploading}
                uploadFinish={uploadFinish}
                uploadedPaper={uploadedPaper}
                reset={this.resetStateToUploadView}
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
          <Button
            label={uploadView ? "Continue" : "Upload different paper"}
            customButtonStyle={styles.button}
            customLabelStyle={styles.label}
            disabled={uploadView && !uploadFinish}
            onClick={!uploadView && this.toggleUploadView}
            isLink={
              uploadView
                ? {
                    href: "/paper/upload/info",
                    linkAs: "/paper/upload/info",
                    query: { uploadPaperTitle: this.state.search },
                  }
                : null
            }
          />
        </div>
      </Modal>
    );
  }
}

const overlayStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: "11",
    borderRadius: 5,
  },
};

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
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
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
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 346,
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
    marginBottom: 20,
  },
  searchResults: {
    overflowY: "scroll",
    width: 526,
    maxHeight: 300,
    paddingTop: 10,
    position: "relative",
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
  },
  backButton: {
    height: 12,
    weight: 16,
    marginRight: 12,
  },
  button: {
    width: 258,
    height: 55,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadPaperModal);
