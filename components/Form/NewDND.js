// NPM
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Redux
import { ModalActions } from "~/redux/modals";
import { PaperActions } from "~/redux/paper";
import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";

// Config
import colors from "../../config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Component
import FormInput from "./FormInput";
import Loader from "../Loader/Loader";
import PaperMetaData from "../SearchSuggestion/PaperMetaData";
import Dropzone from "react-dropzone";
import PaperEntry from "../SearchSuggestion/PaperEntry";

class NewDND extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Toggle b/w DnD & Url
      urlView: false,
      // Drag N Drop
      fileDragging: false,
      fileLoading: false,
      fileDropped: false,
      fileIsPdf: false,
      // Url State
      urlInput: "",
      urlIsValid: false,
      fetching: false,
      inputDisabled: false,
      // File or MetaData
      paper: {},
      // Searching
      searching: false,
      searchResults: [],
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("dragenter", this.setDragOverState, false);
    window.addEventListener("mouseout", this.unsetDragOverState, false);
    // window.addEventListener('drop', this.unsetDragOverState, false);
  }

  componentWillUnmount() {
    window.removeEventListener("dragenter", this.setDragOverState, false);
    window.removeEventListener("mouseout", this.unsetDragOverState, false);
    // window.removeEventListener('drop', this.unsetDragOverState, false);
  }

  setDragOverState = () => {
    !this.state.fileDragging && this.setState({ fileDragging: true });
  };

  unsetDragOverState = () => {
    this.state.fileDragging && this.setState({ fileDragging: false });
  };

  fetchCSL = async (value) => {
    if (value === "") return;
    const param = { url: value };
    this.setState({ inputDisabled: true, fetching: true });
    await fetch(API.SEARCH_BY_URL, API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let { csl_item, url, url_is_pdf } = res;
        let metaData = {};
        metaData = { ...csl_item };
        metaData.name = csl_item.title;
        metaData.url = url;
        this.props.paperActions.uploadPaperToState(metaData);
        this.setState(
          {
            fetching: false,
            urlIsValid: csl_item ? true : false,
            paper: { ...res },
            inputDisabled: false,
          },
          () => {
            // when metadata returns, search existing papers using the title
            this.searchTitle(csl_item.title);
          }
        );
      })
      .catch((err) => {
        this.setState({
          fetching: false,
          urlIsValid: false,
          inputDisabled: false,
        });
      });
  };

  /**
   * search user input among paper titles or DOI
   * @param {String} value - the paper title the user is typing
   */
  searchTitle = (value) => {
    this.setState({ searching: true });
    const config = {
      route: "all",
    };
    fetch(API.SEARCH({ search: value, config }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        this.setState({
          searchResults: [...resp.results],
          searching: false,
        });
      });
  };

  toggleFormatState = () => {
    if (Object.keys(this.state.paper).length < 1) {
      this.setState({ urlView: !this.state.urlView });
    }
  };

  toggleSearchModal = () => {
    this.props.modalActions.openUploadPaperModal(true, [
      ...this.state.searchResults,
    ]);
  };

  resetState = () => {
    //remove paper from redux
    this.props.paperActions.removePaperFromState();
    this.setState({
      paper: {},
      searchResults: [],
      fileDragging: false,
      fileLoading: false,
      fileDropped: false,
      fileIsPdf: false,
    });
  };

  resetStateFromUrl = () => {
    this.props.paperActions.removePaperFromState();
    this.setState(
      {
        paper: {},
        urlInput: "",
        urlIsValid: false,
        fetching: false,
        inputDisabled: false,
        searchResults: [],
      },
      () => {
        this.inputRef.current.focus();
      }
    );
  };

  handleUrlInputChange = (id, value) => {
    if (!this.state.inputDisabled) {
      this.setState(
        {
          urlInput: value,
        },
        () => {
          this.fetchCSL(value);
        }
      );
    }
  };

  handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length < 1) {
      return this.setState({
        fileIsPdf: false,
        fileDropped: true,
      });
    }
    this.setState({ fileLoading: true }, () => {
      setTimeout(() => {
        this.props.handleDrop && this.props.handleDrop(acceptedFiles);
        let file = acceptedFiles[0];
        let paper = this.formatFileToPaperObj(file);
        let title = paper.csl_item.title.split(".pdf")[0];
        this.setState({
          fileLoading: false,
          fileDropped: true,
          fileIsPdf: true,
          paper: paper,
        });
        this.searchTitle(title);
      }, 400);
    });
  };

  formatFileToPaperObj = (file) => {
    let paper = { csl_item: {} };
    paper.url_is_pdf = true;
    paper.csl_item.title = file.name;
    paper.csl_item.type = file.type;
    paper.csl_item.URL = file.path && file.path;
    return paper;
  };

  calculateStyle = () => {
    let classNames = [];
    if (this.state.fileDragging) {
      classNames.push(styles.dragged);
    }
    return classNames;
  };

  calculateButtonStyle = () => {
    if (Object.keys(this.state.paper).length > 0) {
      return styles.buttonDisabled;
    }
  };

  calculateInputDisabled = () => {
    if (
      !Object.keys(this.state.paper).length < 1 &&
      !this.state.inputDisabled
    ) {
      return this.setState(
        { inputDisabled: true },
        () => this.state.inputDisabled
      );
    }
    return this.state.inputDisabled;
  };

  renderDropContent = () => {
    if (this.state.fileLoading) {
      return <Loader loading={true} size={28} />;
    } else {
      return (
        <Fragment>
          <img
            className={css(styles.uploadImage)}
            src={"/static/background/homepage-empty-state.png"}
          />
          <div className={css(styles.instructions)}>
            Drag & drop{"\n"}
            <span className={css(styles.subtext)}>
              your file here, or{" "}
              <span className={css(styles.browse)} id={"browse"}>
                browse
              </span>
            </span>
          </div>
        </Fragment>
      );
    }
  };

  renderContent = () => {
    if (this.state.urlView) {
      return (
        <div className={css(styles.urlContainer)}>
          <FormInput
            getRef={this.inputRef}
            value={this.state.urlInput}
            onChange={this.handleUrlInputChange}
            placeholder={"Paste a url to a pdf"}
            disabled={this.calculateInputDisabled()}
            containerStyle={styles.inputUrl}
            inputStyle={styles.inputStyle}
            inlineNodeRight={
              this.state.urlInput !== "" ? (
                this.state.fetching ? (
                  <span className={css(styles.successIcon)}>
                    <div className={css(styles.icon)}>
                      <Loader loading={true} size={18} />
                    </div>
                  </span>
                ) : (
                  <span
                    className={css(
                      styles.successIcon,
                      !this.state.urlIsValid && styles.errorIcon
                    )}
                  >
                    <div className={css(styles.icon)}>
                      {this.state.urlIsValid ? (
                        <i className="fal fa-check-circle" />
                      ) : (
                        <i className="fal fa-times-circle" />
                      )}
                    </div>
                  </span>
                )
              ) : null
            }
          />
          {this.state.paper.url && (
            <PaperMetaData
              metaData={this.state.paper}
              onRemove={this.resetStateFromUrl}
            />
          )}
        </div>
      );
    } else {
      if (this.state.fileDropped) {
        if (this.state.fileIsPdf) {
          return (
            <PaperMetaData
              metaData={this.state.paper}
              onRemove={this.resetState}
            />
          );
        }
      }
      return (
        <Ripples className={css(styles.dropzoneContainer)}>
          <Dropzone onDrop={this.handleFileDrop} accept="application/pdf">
            {({ getRootProps, getInputProps }) => (
              <section className={css(styles.fullCanvas)}>
                <div
                  {...getRootProps()}
                  className={css(styles.dropzone, this.calculateStyle())}
                >
                  <input {...getInputProps()} />
                  {this.renderDropContent()}
                </div>
              </section>
            )}
          </Dropzone>
        </Ripples>
      );
    }
  };

  render() {
    return (
      <div className={css(styles.componentContainer)}>
        <Ripples
          className={css(styles.urlButton, this.calculateButtonStyle())}
          onClick={this.toggleFormatState}
        >
          {this.state.urlView ? "Upload a PDF" : "Paste a Link"}
        </Ripples>
        {this.renderContent()}
        {this.state.searchResults.length > 0 && (
          <Ripples
            className={css(styles.suggestions)}
            onClick={this.toggleSearchModal}
          >
            {`Found ${this.state.searchResults.length} similar papers`}
          </Ripples>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  componentContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    position: "relative",
  },
  dropzoneContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    backgroundColor: "#F7F7FB",
    cursor: "pointer",
    borderRadius: 3,
    border: `1px dashed ${colors.BLUE()}`,
    outline: "none",
    ":hover": {
      borderStyle: "solid",
    },
    ":hover #browse": {
      textDecoration: "underline",
    },
  },
  urlContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    borderRadius: 3,
    border: `1px solid #B3B3B3`,
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 0px",
    transition: "all ease-out 0.1s",
  },
  dragged: {
    padding: "40px 0",
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
  },
  fullCanvas: {
    height: "100%",
    width: "100%",
  },
  instructions: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  subtext: {
    color: "#757575",
    fontSize: 14,
    marginTop: 15,
  },
  browse: {
    color: colors.BLUE(),
  },
  urlButton: {
    position: "absolute",
    fontSize: 12,
    right: 0,
    top: -28,
    padding: "3px 5px",
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  inputUrl: {
    padding: 0,
    margin: 0,
    minHeight: "unset",
    width: "100%",
  },
  inputStyle: {
    paddingRight: 32,
    fontSize: 14,
    "@media only screen and (max-width: 665px)": {
      fontSize: 12,
    },
  },
  icon: {
    fontSize: 20,
  },
  successIcon: {
    color: colors.GREEN(),
  },
  errorIcon: {
    color: colors.RED(),
  },
  suggestions: {
    color: colors.RED(),
    fontSize: 12,
    padding: "3px 5px",
    position: "absolute",
    right: 0,
    bottom: -25,
    cursor: "pointer",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  paper: state.paper,
  auth: state.auth,
  message: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  paperActions: bindActionCreators(PaperActions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDND);
