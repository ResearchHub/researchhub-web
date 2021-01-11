import React, { Fragment } from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "../../config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Component
import FormInput from "./FormInput";
import Loader from "../Loader/Loader";
import PaperEntry from "../SearchSuggestion/PaperEntry";

class DragNDrop extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      pending: false,
      pdfUrl: "",
      validUrl: false,
      showThumbnail: false,
      dragOver: false,
      isPDF: true,
      searchSuggestions: [],
    };
    this.state = {
      ...this.initialState,
      style: {},
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.getStyleByDimensions);
  }

  componentDidUpdate(prevProp) {
    if (prevProp !== this.props) {
      this.getStyleByDimensions();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getStyleByDimensions);
  }

  handleUrlPaste = (id, value) => {
    this.setState({ pdfUrl: value, pending: true }, async () => {
      let param = {
        url: value,
      };
      if (value === "") return;
      await fetch(API.SEARCH_BY_URL, API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let { csl_item, url, url_is_pdf, search } = res;
          this.setState(
            {
              pending: false,
              validUrl: csl_item ? true : false,
              // searchSuggestions: search,
            },
            () => {
              csl_item &&
                this.props.handleUrl &&
                this.props.handleUrl({ ...res }, value);
            }
          );
        })
        .catch((err) => {
          this.setState({
            pending: false,
            validUrl: false,
          });
        });
    });
  };

  handleDrop = (acceptedFiles) => {
    this.setState({ dragOver: false });
    let isPDF = true;
    let file = acceptedFiles[0];
    let type = file.type.split("/").pop();

    let { accept } = this.props;
    const toAccept = accept ? accept : "application/pdf";

    if (type !== "pdf" && toAccept.includes("pdf")) {
      isPDF = false;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const binaryStr = reader.result;
      if (isPDF) {
        this.props.handleDrop &&
          this.props.handleDrop(acceptedFiles, binaryStr);
      }
      this.setState({ loading: false, isPDF });
    };

    acceptedFiles.forEach((file) => reader.readAsBinaryString(file));
  };

  setDragOverState = (e) => {
    !this.state.dragOver && this.setState({ dragOver: true, isPDF: true });
  };

  unsetDragOverState = (e) => {
    this.state.dragOver && this.setState({ dragOver: false });
  };

  onRemove = () => {
    this.setState({
      ...this.initialState,
    });
    this.props.reset && this.props.reset();
  };

  getStyleByDimensions = () => {
    let { error, isDynamic } = this.props;

    let dropZoneStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 163,
      width: "100%",
      padding: isDynamic && this.state.dragOver ? 15 : 0,
      backgroundColor: this.state.dragOver ? "#FFF" : "#FBFBFD",
      border: `0.5px dashed ${
        error || !this.state.isPDF ? colors.RED(1) : colors.BLUE(1)
      }`,
    };

    if (window.innerWidth < 321) {
      dropZoneStyle.width = 270;
      dropZoneStyle.height = 120;
    } else if (window.innerWidth < 415) {
      dropZoneStyle.width = 338;
      dropZoneStyle.height = 140;
    } else if (window.innerWidth < 665) {
      dropZoneStyle.width = 380;
    } else {
      dropZoneStyle.width = 525;
    }

    this.setState({ style: dropZoneStyle });
  };

  renderSearchSuggestion = () => {
    return (
      this.state.searchSuggestions.length > 0 &&
      !this.props.hideSuggestions && (
        <Fragment>
          <div className={css(styles.searchPrompt)}>
            {`There seems to be ${this.state.searchSuggestions.length} papers with similar titles: \n`}
            <div className={css(styles.regular)}>
              If your paper is not listed, click 'continue' to add more
              information
            </div>
          </div>
          <div className={css(styles.searchSuggestion)}>
            {this.state.searchSuggestions.map((paper, i) => {
              return (
                <PaperEntry
                  data={paper}
                  key={`searchSuggestion-${i}-${paper.id}`}
                  title={paper.title}
                  paperId={paper.id}
                />
              );
            })}
          </div>
        </Fragment>
      )
    );
  };

  render() {
    let {
      loading,
      uploadedPaper,
      uploadFinish,
      pasteUrl,
      accept,
      noPasteUrl,
    } = this.props;
    const toAccept = accept ? accept : "application/pdf";
    return (
      <div
        className={css(styles.container)}
        onDragLeave={this.unsetDragOverState}
      >
        <Dropzone
          onDrop={(acceptedFiles) => this.handleDrop(acceptedFiles)}
          accept={toAccept}
          onDragEnter={this.setDragOverState}
          onDragOver={this.setDragOverState}
        >
          {({ getRootProps, getInputProps }) => (
            <section
              className="container"
              style={uploadFinish ? style.uploadedPaper : this.state.style}
            >
              {uploadFinish ? (
                <Fragment>
                  <PaperEntry
                    fileUpload={true}
                    file={uploadedPaper}
                    onRemove={this.onRemove}
                    mobileStyle={styles.mobileStyle}
                    url={this.props.url ? this.props.url : this.state.validUrl}
                  />
                  {this.renderSearchSuggestion()}
                </Fragment>
              ) : (
                <div
                  {...getRootProps({ className: "dropzone" })}
                  style={style.inputWrapper}
                >
                  <input {...getInputProps()} />
                  {loading ? (
                    <Loader />
                  ) : (
                    <img
                      className={css(styles.icon)}
                      src={"/static/icons/dragNdrop.png"}
                      alt="Drag N Drop Icon"
                    />
                  )}
                  {!toAccept.includes("pdf") || this.state.isPDF ? (
                    <p className={css(styles.label)}>
                      {"Drag & drop or "}
                      <span className={css(styles.browse)}>browse</span>
                      {" to upload"}
                    </p>
                  ) : (
                    <p className={css(styles.label, styles.error)}>
                      File type is not a PDF. Please try again
                    </p>
                  )}
                </div>
              )}
            </section>
          )}
        </Dropzone>
        {!uploadFinish && !noPasteUrl && (
          <p
            className={css(styles.pasteInstruction, !pasteUrl && styles.link)}
            onClick={!pasteUrl ? this.props.openUploadPaperModal : null}
          >
            or paste a url for the paper
          </p>
        )}
        {pasteUrl && !uploadFinish && (
          <FormInput
            placeholder={"Paste a url for the paper"}
            containerStyle={styles.noMargin}
            inputStyle={styles.urlInput}
            value={this.state.pdfUrl}
            onChange={this.handleUrlPaste}
            inlineNodeRight={
              this.state.pdfUrl !== "" ? (
                this.state.pending ? (
                  <span className={css(styles.successIcon)}>
                    <Loader loading={true} size={23} />
                  </span>
                ) : (
                  <span
                    className={css(
                      styles.successIcon,
                      !this.state.validUrl && styles.errorIcon
                    )}
                  >
                    {this.state.validUrl ? (
                      <i className="fal fa-check-circle" />
                    ) : (
                      <i className="fal fa-times-circle" />
                    )}
                  </span>
                )
              ) : null
            }
          />
        )}
      </div>
    );
  }
}

const style = {
  inputWrapper: {
    highlight: "none",
    outline: "none",
    userSelect: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedPaper: {
    border: "none",
    backgroundColor: "#fff",
  },
};

const styles = StyleSheet.create({
  dropZone: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 163,
    width: 525,
    backgroundColor: "#FBFBFD",
    border: `0.5 dashed ${colors.BLUE(1)}`,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
    highlight: "none",
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  browse: {
    color: colors.BLUE(1),
    textDecoration: "underline",
  },
  icon: {
    height: 29.87,
    width: 38.53,
    cursor: "pointer",
    marginBottom: 8,
    "@media only screen and (max-width: 415px)": {
      height: 23,
      width: 30,
    },
  },
  pasteInstruction: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    height: 50,
    color: "#4f4d5f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    margin: 0,
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noMargin: {
    margin: 0,
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  urlInput: {
    // height: 20,
  },
  error: {
    color: colors.RED(1),
  },
  mobileStyle: {
    "@media only screen and (max-width: 665px)": {
      width: 348,
    },
    "@media only screen and (max-width: 415px)": {
      width: 302,
    },
    "@media only screen and (max-width: 321px)": {
      width: 238,
    },
  },
  successIcon: {
    color: colors.GREEN(1),
    fontSize: 28,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFBFB",
  },
  errorIcon: {
    color: colors.RED(1),
  },
  searchSuggestion: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 525,
    height: 172,
    overflow: "scroll",
    marginBottom: 15,
    padding: "0px 10px 0px 10px",
    boxSizing: "border-box",
  },
  searchPrompt: {
    fontSize: 14,
    color: colors.BLUE(),
    paddingTop: 5,
    paddingBottom: 15,
    textAlign: "center",
    whiteSpace: "pre-wrap",
    fontWeight: 500,
  },
  regular: {
    fontWeight: 400,
    paddingTop: 10,
    color: "#4f4d5f",
  },
  link: {
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

export default DragNDrop;
