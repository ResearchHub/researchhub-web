import React from "react";
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
      await fetch(API.CHECKURL, API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let { found_file } = res;
          this.setState({
            pending: false,
            validUrl: found_file,
          });
          setTimeout(() => {
            found_file && this.props.handleUrl && this.props.handleUrl(value);
          }, 300);
        })
        .catch((err) => {
          this.setState({
            pending: false,
            validUrl: false,
          });
        });
    });
  };

  handleDrop = async (acceptedFiles) => {
    await this.setState({ dragOver: false });
    let isPDF = true;
    let file = acceptedFiles[0];
    let type = file.type.split("/").pop();
    if (type !== "pdf") {
      isPDF = false;
    }

    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
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

  render() {
    let { loading, uploadedPaper, uploadFinish, pasteUrl } = this.props;

    return (
      <div
        className={css(styles.container)}
        onDragLeave={this.unsetDragOverState}
      >
        <Dropzone
          onDrop={(acceptedFiles) => this.handleDrop(acceptedFiles)}
          accept="application/pdf"
          onDragEnter={this.setDragOverState}
          onDragOver={this.setDragOverState}
        >
          {({ getRootProps, getInputProps }) => (
            <section
              className="container"
              style={uploadFinish ? style.uploadedPaper : this.state.style}
            >
              {uploadFinish ? (
                <PaperEntry
                  fileUpload={true}
                  file={uploadedPaper}
                  onRemove={this.onRemove}
                  mobileStyle={styles.mobileStyle}
                  url={this.props.url ? this.props.url : this.state.validUrl}
                />
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
                    />
                  )}
                  {this.state.isPDF ? (
                    <p className={css(styles.label)}>
                      {"Drag & drop or "}
                      <span className={css(styles.browse)}>browse</span>
                      {" PDF to upload"}
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
        {pasteUrl && !uploadFinish && (
          <p className={css(styles.pasteInstruction)}>
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
                      <i class="fal fa-times-circle" />
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
});

export default DragNDrop;
