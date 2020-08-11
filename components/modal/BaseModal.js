// NPM Modules
import React, { Fragment, Children } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";

// Redux
import { ModalActions } from "../../redux/modals";

class BaseModal extends React.Component {
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
      if (this.state.mobileView) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
      }
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
  closeModal = () => {
    this.setState({ reveal: false }, () => {
      setTimeout(() => {
        this.setState({
          ...this.initialState,
        });
        this.enableParentScroll();
        this.props.closeModal && this.props.closeModal();
      }, 200);
    });
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

  getMobileState = () => {
    this.props.getMobileState &&
      this.props.getMobileState(this.state.mobileView);
  };

  getOverlayStyle = () => {
    if (this.props.overlayStyle) {
      return this.props.overlayStyle;
    }
    return {
      overlay: {
        position: "fixed",
        top: this.props.offset
          ? this.props.offset
          : this.state.mobileView
          ? 80
          : 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: "11",
        borderRadius: 5,
      },
    };
  };

  isMobileView = () => {
    return this.state.mobileView;
  };

  render() {
    let { enableScroll } = this.props;
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
        onAfterOpen={this.disableParentScroll}
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
            />
          )}
          {!this.props.removeDefault && (
            <Fragment>
              <img
                src={"/static/icons/close.png"}
                className={css(
                  styles.closeButton,
                  this.props.backgroundImage && styles.zIndex
                )}
                onClick={this.closeModal}
                draggable={false}
              />
              <div
                className={css(
                  styles.titleContainer,
                  this.props.backgroundImage && styles.zIndex
                )}
              >
                <div className={css(styles.title, styles.text)}>
                  {this.props.title && typeof this.props.title === "function"
                    ? this.props.title()
                    : this.props.title}
                </div>
                {this.props.subtitle && (
                  <div className={css(styles.subtitle, styles.text)}>
                    {typeof this.props.subtitle === "function"
                      ? this.props.subtitle()
                      : this.props.subtitle}
                  </div>
                )}
              </div>
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
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 50,
    overflow: "scroll",
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
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
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
    width: "100%",
    fontWeight: "400",
    color: "#4f4d5f",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
      width: 300,
    },
  },
  text: {
    fontFamily: "Roboto",
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseModal);
