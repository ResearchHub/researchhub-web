import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
/***
 * @patr
 */

import { Component } from "react";
import dynamic from "next/dynamic";

// NPM Modules
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Redux
import { MessageActions } from "~/redux/message";

const Loader = dynamic(() => import("./Loader"));

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transition: false,
    };
  }

  eventListen = () => {
    let { messageActions } = this.props;
    messageActions.showMessage({ show: false });
    document.removeEventListener("click", this.eventListen, true);
    document.removeEventListener("touchstart", this.eventListen, true);
  };

  componentDidUpdate(prevProps, prevState) {
    let { messageActions, message } = this.props;
    if (this.props.message.show) {
      if (this.props.message.clickoff) {
        document.addEventListener("touchstart", this.eventListen, true);
        document.addEventListener("click", this.eventListen, true);
      } else if (!this.props.message.load) {
        this.popupMessageTimeout = setTimeout(() => {
          messageActions.showMessage({ show: false });
        }, message.timeout || 2000);
      }
    }
  }

  componentDidMount() {
    this.loader = require("@lottiefiles/react-lottie-player").Player;
  }

  render() {
    let { message } = this.props;
    if (message.load && !this.loader) {
      return null;
    }
    return (
      <div
        className={css(
          styles.popupMessage,
          !message.show && styles.hide,
          message.load && styles.load
        )}
      >
        {message.load ? (
          <div className={css(styles.loadContainer)}>
            <Loader loading={true} Component={this.loader} />
          </div>
        ) : (
          <span style={inlineStyle.check} color="#fff">
            {message.error ? (
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            )}
          </span>
        )}
        {!message.load && (
          <div className={css(styles.message)}>{String(message.message)}</div>
        )}
      </div>
    );
  }
}

const inlineStyle = {
  check: {
    color: "#FFF",
    fontSize: 40,
  },
};

var styles = StyleSheet.create({
  popupMessage: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0, 0, 0, .8)",
    padding: "16px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // this is intentionally higher than `LoginModal`'s z-index
    zIndex: 1000000002,
    whiteSpace: "pre-wrap",
  },
  load: {
    background: "rgb(249, 249, 252)",
    boxShadow: "0px 0px 10px 0px #00000026",
  },
  loadContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  hide: {
    display: "none",
  },
  message: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "300",
    textAlign: "center",
    fontFamily: "Roboto",
    whiteSpace: "pre-wrap",
  },
});

const mapStateToProps = (state) => ({
  message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
  messageActions: bindActionCreators(MessageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
