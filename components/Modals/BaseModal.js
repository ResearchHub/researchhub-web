// NPM Modules
import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";
import { CloseIcon } from "~/config/themes/icons";
import "./Stylesheets/Modal.module.css";

// Redux
import { ModalActions } from "../../redux/modals";
import colors from "~/config/themes/colors";

class BaseModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      reveal: false,
      mobileView: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    setTimeout(() => this.setState({ reveal: true }), 200);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      // if (this.state.mobileView) {
      //   document.body.scrollTop = 0; // For Safari
      //   document.documentElement.scrollTop = 0;
      // }
      this.updateDimensions();
      if (this.state.reveal) {
        this.setState({ reveal: false });
        setTimeout(() => this.setState({ reveal: true }), 200);
      } else {
        this.setState({ reveal: true });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    this.setState({
      ...this.initialState,
    });
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
    this.getMobileState();
  };

  /**
   * closes the modal on button click
   */
  closeModal = (e) => {
    if (this.props?.persistent) return;

    this.setState({ reveal: false }, () => {
      setTimeout(() => {
        this.setState({
          ...this.initialState,
        });
        this.props.closeModal && this.props.closeModal(e);
      }, 200);
    });
  };

  getMobileState = () => {
    this.props.getMobileState &&
      this.props.getMobileState(this.state.mobileView);
  };

  getOverlayStyle = () => {
    if (this.props.overlayStyle) {
      return this.props.overlayStyle;
    }
    const overlayStyleOverride = this.props.overlayStyleOverride || {};
    return {
      overlay: {
        position: "fixed",
        top: this.props.offset || 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: this.props.zIndex ? this.props.zIndex : "11",
        ...overlayStyleOverride,
      },
    };
  };

  isMobileView = () => {
    return this.state.mobileView;
  };

  render() {
    let { isOpen } = this.props;

    return (
      <Modal
        isOpen={this.props.isOpen}
        closeModal={this.closeModal}
        onRequestClose={this.closeModal}
        className={css(
          styles.modal,
          this.props.modalStyle && this.props.modalStyle
        )}
        shouldCloseOnOverlayClick={
          this.props.closeOnOverlayClick !== undefined ||
          this.props.closeOnOverlayClick !== null
            ? this.props.closeOnOverlayClick
            : true
        }
        style={this.getOverlayStyle()}
        ariaHideApp={false}
      >
        <div
          className={css(
            styles.modalContent,
            this.props.removeDefault && styles.removeDefault,
            this.props.modalContentStyle && this.props.modalContentStyle,
            this.state.reveal && styles.reveal
          )}
        >
          {this.props.backgroundImage && (
            <img
              className={css(styles.backgroundImage)}
              src={"/static/background/background-modal.png"}
              draggable={false}
              alt="ResearchHub Modal Background"
            />
          )}
          {!this.props.removeDefault && (
            <Fragment>
              {!this.props.hideClose && (
                <div className={css(styles.closeButtonWrapper)}>
                  <CloseIcon
                    overrideStyle={styles.close}
                    color={colors.MEDIUM_GREY()}
                    onClick={this.closeModal}
                  />
                </div>
              )}
              {this.props.title && (
                <div
                  className={css(
                    styles.titleContainer,
                    this.props.backgroundImage && styles.zIndex,
                    this.props.textAlign === "left" && styles.left
                  )}
                >
                  <div
                    className={css(
                      styles.title,
                      this.props.titleStyle && this.props.titleStyle
                    )}
                  >
                    {this.props.title && typeof this.props.title === "function"
                      ? this.props.title()
                      : this.props.title}
                  </div>
                  {this.props.subtitle && (
                    <div
                      className={css(
                        styles.subtitle,
                        this.props.subtitleStyle && this.props.subtitleStyle
                      )}
                    >
                      {typeof this.props.subtitle === "function"
                        ? this.props.subtitle()
                        : this.props.subtitle}
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          )}
          {this.props.children}
        </div>
      </Modal>
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
    borderRadius: 5,
    boxSizing: "border-box",
    boxShadow: "rgb(0 0 0 / 28%) 0px 8px 28px",
    maxHeight: "90vh",
    overflow: "auto",
    "@media only screen and (max-width: 665px)": {
      width: "90%",
      borderRadius: 0,
    },
    "@media only screen and (max-width: 436px)": {
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      transform: "unset",
    },
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 50,
    overflowY: "auto",
    opacity: 0,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  removeDefault: {
    padding: 0,
    "@media only screen and (max-width: 767px)": {
      padding: 0,
    },
    "@media only screen and (max-width: 415px)": {
      padding: 0,
    },
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    objectFit: "contain",
    userSelect: "none",
  },
  reveal: {
    opacity: 1,
  },
  closeButtonWrapper: {
    position: "absolute",
    cursor: "pointer",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    width: "100%",
  },
  left: {
    textAlign: "left",
    alignItems: "left",
    width: "100%",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
      fontSize: 24,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  subtitle: {
    marginTop: 15,
    fontSize: 16,
    minHeight: 22,
    lineHeight: 1.5,
    width: "100%",
    fontWeight: "400",
    color: "#4f4d5f",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    maxWidth: 450,
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
      width: 300,
    },
  },
  zIndex: {
    zIndex: 12,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseModal);
