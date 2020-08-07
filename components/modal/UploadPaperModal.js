// NPM Modules
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Ripple from "react-ripples";

// Next
import Router from "next/router";

// Redux
import { ModalActions } from "../../redux/modals";
import { PaperActions } from "../../redux/paper";
import { MessageActions } from "../../redux/message";

// Component
import BaseModal from "../modal/BaseModal";
import SearchEntry from "../SearchEntry";
import PaperMetaData from "../SearchSuggestion/PaperMetaData";
import PaperEntryCard from "../Hubs/PaperEntryCard";

// Config
import colors from "~/config/themes/colors";

const TRANSITION_TIME = 300;

class UploadPaperModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
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
      if (
        prevProps.modals.uploadPaperModal.suggestedPapers !==
        this.props.modals.uploadPaperModal.suggestedPapers
      ) {
        this.setState({
          papers: this.props.modals.uploadPaperModal.suggestedPapers,
        });
      }
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
    this.enableParentScroll();
    modalActions.openUploadPaperModal(false);
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

  renderSearchResults = () => {
    let results = this.props.modals.uploadPaperModal.suggestedPapers;

    return results.map((paper, index) => {
      paper.meta = {};
      return (
        <Fragment>
          {results.length > 1 && <div className={css(styles.divider)} />}
          <Ripple
            className={css(styles.searchEntryContainer)}
            onClick={this.closeModal}
          >
            {/* <SearchEntry
              indexName="paper"
              result={paper}
              hideBullets={true}
              onClickCallBack={this.closeModal}
            /> */}
            <PaperEntryCard
              paper={paper}
              style={styles.paper}
              onClick={() => setTimeout(this.closeModal, 400)}
            />
          </Ripple>
          {/** separate div needed to prevent ripple behavior which leaks to padding/margin */}
          {results.length > 1 && <div className={css(styles.divider)} />}
        </Fragment>
      );
    });
  };

  renderText = () => {
    let results = this.props.modals.uploadPaperModal.suggestedPapers;

    if (results.length > 1) {
      return `${results.length} similar papers already on ResearchHub`;
    }
    if (results.length === 1) {
      return "This paper is already on ResearchHub";
    }
  };

  render() {
    let { modals } = this.props;
    let count = this.props.modals.uploadPaperModal.suggestedPapers.length;
    return (
      <BaseModal
        isOpen={modals.openUploadPaperModal}
        closeModal={this.closeModal}
        onRequestClose={this.closeModal}
        removeDefault={true}
      >
        <div className={css(styles.modalContent)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
          />
          <div className={css(styles.header)}>Search Results:</div>
          <div className={css(styles.searchCount)}>{this.renderText()}</div>
          <div className={css(styles.searchResults)}>
            {this.renderSearchResults()}
          </div>
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
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
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
  header: {
    fontWeight: 500,
    width: "100%",
    textAlign: "left",
    marginBottom: 25,
  },
  searchCount: {
    width: "100%",
    textAlign: "center",
    fontWeight: 400,
    fontSize: 14,
    color: "#4f4d5f",
    marginBottom: 25,
    textShadow: "1px 1px 2px #FAFAFA",
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
  paperSummary: {
    marginBottom: 25,
    width: "100%",
    maxWidth: 600,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  searchResultContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    overflowY: "auto",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.24)",
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
    width: 600,
    maxHeight: 400,
    padding: "10px 15px",
    boxSizing: "border-box",
    position: "relative",
    backgroundColor: "#F7F7FB",
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
  searchEntryContainer: {
    width: "100%",
    // backgroundColor: "#fff",
  },
  divider: {
    width: "100%",
    height: 5,
    background: "#F7F7FB",
  },
  paper: {
    width: "100%",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  paper: state.paper,
  uploadedPaper: state.paper.uploadedPaper,
  uploadedPaperMeta: state.paper.uploadedPaperMeta,
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
