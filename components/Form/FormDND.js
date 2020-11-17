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

class FormDND extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Toggle b/w DnD & Url
      urlView: true,
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
      // paper: {},
      // cslPaper: {},
      // Searching
      searching: false,
      searchResults: [],
      isDuplicate: false,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("dragenter", this.setDragOverState, false);
    window.addEventListener("mouseout", this.unsetDragOverState, false);
    if (this.props.uploadedPaper) {
      // only configure if there's a paper in redux
      this.configureStateFromProps();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.uploadedPaper !== this.props.uploadedPaper) {
        if (Object.keys(this.props.uploadedPaper).length > 0) {
          this.configureStateFromProps();
        }
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("dragenter", this.setDragOverState, false);
    window.removeEventListener("mouseout", this.unsetDragOverState, false);
  }

  configureStateFromProps = () => {
    let { uploadedPaper, uploadedPaperMeta } = this.props;
    // find a different way to determine whether paper is a file or upload
    if (Object.keys(uploadedPaper).length > 0) {
      if (
        Object.keys(uploadedPaperMeta).length > 0 &&
        !uploadedPaperMeta.isFile
      ) {
        // Configure to active Url State
        this.setState(
          {
            urlInput: uploadedPaperMeta.url ? uploadedPaperMeta.url : "",
            urlView: true,
            urlIsValid: true,
            fileDropped: false,
            fileIsPdf: false,
          },
          () => {
            if (this.state.searchResults.length < 1) {
              let title = uploadedPaper.name;
              // this.searchTitle(title);
            }
          }
        );
      } else {
        // Configure to successful Drop State
        this.setState(
          {
            urlView: false,
            urlIsValid: false,
            fileDropped: true,
            fileIsPdf: true,
          },
          () => {
            if (this.state.searchResults.length < 1) {
              let title = uploadedPaperMeta.csl_item.name;
              // this.searchTitle(title);
            }
          }
        );
      }
    }
  };

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
        this.props.paperActions.uploadPaperToState(metaData, { ...res });
        this.setState(
          {
            fetching: false,
            urlIsValid: csl_item ? true : false,
            inputDisabled: false,
            searchResults: [],
            isDuplicate: false,
          },
          () => {
            // when metadata returns, search existing papers using the title
            // this.searchTitle(csl_item.title);
            this.props.onValidUrl && this.props.onValidUrl();
          }
        );
      })
      .catch((err) => {
        let { messageActions } = this.props;
        if (!err.response) {
          messageActions.setMessage(
            "We can't find the paper from your link. Upload the PDF or use another link."
          );
          messageActions.showMessage({ show: true, error: true });
        }
        if (err.response.status === 429) {
          this.props.modalActions.openRecaptchaPrompt(true);
        } else if (err.response.status === 401) {
          this.props.modalActions.openLoginModal(true);
        } else if (err.response.status === 403) {
          let { results, key } = err.message;
          this.setState(
            {
              searchResults: key === "title" ? [...results] : [results],
              isDuplicate: true,
            },
            () => {
              this.toggleSearchModal();
              this.props.onDuplicate && this.props.onDuplicate();
            }
          );
        }
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
    fetch(
      API.SEARCH_MATCHING_PAPERS({ search: value, external_search: false }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        this.setState(
          {
            searchResults: [...resp.results],
            searching: false,
          },
          () => {
            this.props.onSearch &&
              this.props.onSearch(this.state.searchResults);
          }
        );
      });
  };

  toggleFormatState = () => {
    if (Object.keys(this.props.uploadedPaper).length < 1) {
      this.setState({ urlView: !this.state.urlView }, () => {
        this.state.urlView && this.inputRef.current.focus();
      });

      this.props.toggleFormatState && this.props.toggleFormatState();
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
    this.setState(
      {
        searchResults: [],
        fileDragging: false,
        fileLoading: false,
        fileDropped: false,
        fileIsPdf: false,
        isDuplicate: false,
      },
      () => {
        this.props.onRemove && this.props.onRemove();
      }
    );
  };

  resetStateFromUrl = () => {
    this.props.paperActions.removePaperFromState();
    this.setState(
      {
        urlInput: "",
        urlIsValid: false,
        fetching: false,
        inputDisabled: false,
        searchResults: [],
        isDuplicate: false,
      },
      () => {
        this.inputRef.current.focus();
        this.props.onRemove && this.props.onRemove();
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

  handleFileDrop = async (acceptedFiles) => {
    if (acceptedFiles.length < 1) {
      return this.setState({
        fileIsPdf: false,
        fileDropped: true,
      });
    }
    let paperMetaData = this.formatFileToPaperObj(acceptedFiles[0]);
    this.props.handleDrop &&
      this.props.handleDrop(acceptedFiles, paperMetaData);
    this.setState({
      fileDropped: true,
      fileIsPdf: true,
    });
  };

  formatFileToPaperObj = (file) => {
    let paper = { csl_item: {} };
    paper.isFile = true;
    paper.url_is_pdf = true;
    paper.csl_item.title = file.name;
    paper.csl_item.type = file.type;
    paper.csl_item.URL = file.path && file.path;
    paper.csl_item.name = file.name.split(".pdf")[0];
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
    if (Object.keys(this.props.uploadedPaper).length > 0) {
      return styles.buttonDisabled;
    }
  };

  calculateInputDisabled = () => {
    if (
      Object.keys(this.props.uploadedPaper).length > 0 &&
      !this.state.inputDisabled
    ) {
      return this.setState({ inputDisabled: true }, () => {
        this.state.inputDisabled;
      });
    } else if (
      Object.keys(this.props.uploadedPaper).length < 1 &&
      this.state.inputDisabled
    ) {
      return this.setState(
        {
          inputDisabled: false,
        },
        () => {
          this.state.inputDisabled;
        }
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
            required={true}
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
          {(this.state.urlIsValid ||
            Object.keys(this.props.uploadedPaperMeta).length > 0) && (
            <PaperMetaData
              metaData={this.props.uploadedPaperMeta}
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
              metaData={this.props.uploadedPaperMeta}
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
                  <input {...getInputProps()} required={true} />
                  {this.renderDropContent()}
                </div>
              </section>
            )}
          </Dropzone>
        </Ripples>
      );
    }
  };

  renderSearchResult = () => {
    let { searchResults, isDuplicate } = this.state;
    if (searchResults.length) {
      const renderText = () => {
        if (isDuplicate) {
          return "This paper is already on ResearchHub";
        }
        if (searchResults.length > 1) {
          return `Found ${searchResults.length} similar papers already on ResearchHub`;
        }
        return `Found a similar paper already on ResearchHub`;
      };

      return (
        <Ripples
          className={css(styles.suggestions)}
          onClick={this.toggleSearchModal}
        >
          {renderText()}
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
        {this.renderSearchResult()}
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
    paddingRight: 35,
    fontSize: 14,
    "::placeholder": {
      transition: "all ease-in-out 0.2s",
      opacity: 1,
    },
    ":focus": {
      "::placeholder": {
        transition: "all ease-in-out 0.2s",
        opacity: 0,
      },
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 12,
    },
  },
  icon: {
    fontSize: 20,
    // paddingBottom: 5,
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
    padding: "3px 0px 3px 5px",
    position: "absolute",
    right: 0,
    bottom: -25,
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  paper: state.paper,
  uploadedPaper: state.paper.uploadedPaper,
  uploadedPaperMeta: state.paper.uploadedPaperMeta,
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
)(FormDND);
