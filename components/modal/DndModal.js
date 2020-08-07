import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import Dropzone from "react-dropzone";
import DragNDrop from "@quantfive/react-image-upload-grid";
import "./Stylesheets/Dnd.css";

// Component
import BaseModal from "./BaseModal";
import Loader from "~/components/Loader/Loader";
import Button from "~/components/Form/Button";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "../../config/themes/colors";

class DndModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      loading: false,
      file: null,
      files: [],
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.openDndModal.props !== this.props.openDndModal.props) {
        this.resetState();
      }
    }
  }

  handleFileDrop = (acceptedFiles) => {
    let file = acceptedFiles && acceptedFiles[0]; // we grab the first file
    let reader = new FileReader();
    reader.onload = (event) => {
      this.setState({ loading: false, file }, () => {
        if (file.type === "application/pdf") {
          let pdfPreview = URL.createObjectURL(file);
          window.open(pdfPreview);
        } else {
          document.getElementById("preview").src = event.target.result;
        }
      });
    };

    reader.readAsDataURL(file);
  };

  resetState = () => {
    this.setState({
      ...this.initialState,
    });
  };

  closeModal = () => {
    this.props.openDndModal(false, {});
    document.body.style.overflow = "scroll";
    this.setState({
      ...this.initialState,
    });
  };

  onSubmit = () => {
    let { onSubmit, paperId } = this.props.modals.openDndModal.props;
    onSubmit([...this.state.files], this.closeModal);
  };

  imageAddedCallback = (files) => {
    let images = [...this.state.files, ...files];

    if (images.length > 3) {
      images[2] = files[files.length - 1];
      images = images.slice(0, 3);
    }

    this.setState({
      files: images,
    });
  };

  removeImageCallback = (index) => {
    let images = [...this.state.files];
    images.splice(index, 1);
    this.setState({ files: images });
  };

  onSortEnd = (images) => {
    this.setState({
      files: images,
    });
  };

  renderDropContent = () => {
    if (this.state.loading) {
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

  calculateStyle = () => {
    if (this.state.files.length < 2) {
      return "single";
    } else if (this.state.files.length === 2) {
      return "half";
    } else if (this.state.files.length > 2) {
      return "DndItem";
    }
  };

  renderContent = () => {
    let { fileAccept } = this.props.modals.openDndModal.props;

    let { files, pendingSubmission, pdfPreview } = this.state;
    return (
      <Fragment>
        <DragNDrop
          images={this.state.files}
          imageAddedCallback={this.imageAddedCallback}
          removeImageCallback={this.removeImageCallback}
          onSortEnd={this.onSortEnd}
          addImageClassName={
            this.state.files.length > 0 ? "DndHero single" : "DndDefault"
          }
          imageContainerClassName={this.calculateStyle()}
          fileAccept={fileAccept}
          addImageText={
            this.state.files.length < 1 ? (
              this.renderDropContent()
            ) : (
              <i className="fal fa-plus" />
            )
          }
        />
        {files.length > 0 && (
          <div className={css(styles.buttonRow)}>
            <Ripples
              className={css(
                styles.cancelButton,
                pendingSubmission && styles.disabled
              )}
              onClick={pendingSubmission ? null : () => this.resetState()}
            >
              Cancel
            </Ripples>
            <Button
              label={
                pendingSubmission ? (
                  <Loader loading={true} size={20} color={"#fff"} />
                ) : (
                  "Submit"
                )
              }
              size={"small"}
              onClick={this.onSubmit}
              disabled={pendingSubmission}
            />
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const { modals } = this.props;
    let { isOpen, props } = modals.openDndModal;
    return (
      <BaseModal
        isOpen={isOpen}
        closeModal={this.closeModal}
        title={props.title && props.title} // this needs to
        subtitle={props.subtitle && props.subtitle}
      >
        <div className={css(styles.container)}>{this.renderContent()}</div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minWidth: 500,
    maxWidth: 800,
    overflowX: "hidden",
    marginTop: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      width: "90%",
      minWidth: "unset",
      maxWidth: "unset",
      boxSizing: "border-box",
    },
  },
  dropzoneContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: "100%",
    minHeight: 200,
    width: "90%",
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
  fullCanvas: {
    height: "100%",
    width: "100%",
  },
  uploadImage: {
    height: 80,
    paddingBottom: 10,
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
  imagePreview: {
    width: 400,
    height: 300,
    maxHeight: "50vh",
    overflow: "hidden",
    objectFit: "contain",
    "@media only screen and (max-width: 415px)": {
      width: "70%",
    },
  },
  image: {
    objectFit: "contain",
    height: "100%",
    minHeight: "100%",
    maxHeight: "100%",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
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
  dndHero: {
    height: 150,
    wdith: 150,
    border: `1px dashed ${colors.BLUE()}`,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openDndModal: ModalActions.openDndModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DndModal);
