import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import Dropzone from "react-dropzone";

// Component
import BaseModal from "./BaseModal";
import Loader from "~/components/Loader/Loader";
import Button from "~/components/Form/Button";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "../../config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ModalConstants } from "../../redux/modals";

class DndModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      loading: false,
      file: null,
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
        document.getElementById("preview").src = event.target.result;
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

  postFigure = () => {
    let { callback, paperId } = this.props.modals.openDndModal.props;
    let { showMessage, setMessage } = this.props;
    showMessage({ load: true, show: true });
    this.setState({ pendingSubmission: true });

    let params = new FormData();

    params.append("figure", this.state.file);
    params.append("paper", paperId);
    params.append("figure_type", "FIGURE");

    return fetch(API.ADD_FIGURE({ paperId }), API.POST_FILE_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          pendingSubmission: false,
        });
        showMessage({ show: false });
        setMessage("Figure uploaded successfully");
        showMessage({ show: true });
        let newFigure = res.file;
        callback(newFigure); // callback passed through redux
        this.closeModal();
      })
      .catch((err) => {
        console.log("err", err);
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
        this.setState({
          pendingSubmission: false,
        });
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

  renderContent = () => {
    let { file, pendingSubmission } = this.state;
    if (file) {
      return (
        <Fragment>
          <div className={css(styles.imagePreview)}>
            <img id="preview" className={css(styles.image)} />
          </div>
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
              onClick={this.postFigure}
              disabled={pendingSubmission}
            />
          </div>
        </Fragment>
      );
    } else {
      return (
        <Ripples className={css(styles.dropzoneContainer)}>
          <Dropzone onDrop={this.handleFileDrop} accept="image/png, image/jpeg">
            {({ getRootProps, getInputProps }) => (
              <section className={css(styles.fullCanvas)}>
                <div {...getRootProps()} className={css(styles.dropzone)}>
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
    width: 600,
    overflowX: "hidden",
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      width: "90%",
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
