import React from "react";
import Dropzone from "react-dropzone";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "../config/themes/colors";

// Component
import FormInput from "./FormInput";
import Loader from "./Loader/Loader";
import PaperEntry from "./SearchSuggestion/PaperEntry";

class DragNDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOver: false,
    };
  }

  handleDrop = async (acceptedFiles) => {
    await this.setState({ dragOver: false });
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;
      this.props.handleDrop && this.props.handleDrop(acceptedFiles, binaryStr);
      this.setState({ loading: false });
    };

    acceptedFiles.forEach((file) => reader.readAsBinaryString(file));
  };

  setDragOverState = (e) => {
    !this.state.dragOver && this.setState({ dragOver: true });
  };

  unsetDragOverState = (e) => {
    this.state.dragOver && this.setState({ dragOver: false });
  };

  onRemove = () => {
    this.props.reset && this.props.reset();
  };

  render() {
    let { loading, uploadedPaper, uploadFinish } = this.props;
    const style = {
      dropZone: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 163,
        width: 525,
        backgroundColor: this.state.dragOver ? "#FFF" : "#FBFBFD",
        border: `0.5px dashed ${colors.BLUE(1)}`,
      },
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

    return (
      <div className={css(styles.container)}>
        <Dropzone
          onDrop={(acceptedFiles) => this.handleDrop(acceptedFiles)}
          onDragEnter={this.setDragOverState}
          onDragOver={this.setDragOverState}
          onDragLeave={this.unsetDragOverState}
        >
          {({ getRootProps, getInputProps }) => (
            <section
              className="container"
              style={uploadFinish ? style.uploadedPaper : style.dropZone}
            >
              {uploadFinish ? (
                <PaperEntry
                  fileUpload={true}
                  file={uploadedPaper}
                  onRemove={this.onRemove}
                />
              ) : (
                <div
                  {...getRootProps({ className: "dropzone" })}
                  style={style.inputWrapper}
                >
                  <input {...getInputProps()} />
                  {this.props.loading ? (
                    <Loader />
                  ) : (
                    <img
                      className={css(styles.icon)}
                      src={"/static/icons/dragNdrop.png"}
                    />
                  )}
                  <p className={css(styles.label)}>
                    {"Drag & drop or "}
                    <span className={css(styles.browse)}>browse</span>
                    {" PDF to upload"}
                  </p>
                </div>
              )}
            </section>
          )}
        </Dropzone>
        {this.props.pasteUrl && (
          <p className={css(styles.pasteInstruction)}>
            or paste a url for the paper
          </p>
        )}
        {this.props.pasteUrl && (
          <FormInput
            placeholder={"Paste a url for the paper"}
            containerStyle={styles.noMargin}
            inputStyle={styles.urlInput}
          />
        )}
      </div>
    );
  }
}

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
  },
  browse: {
    color: colors.BLUE(1),
    textDecoration: "underline",
  },
  icon: {
    height: 29.87,
    width: 38.53,
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
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noMargin: {
    margin: 0,
  },
  urlInput: {
    height: 20,
  },
});

export default DragNDrop;
