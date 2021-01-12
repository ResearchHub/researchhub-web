/***
 * @patr
 */

import React, { Component } from "react";

// NPM Modules
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Component
import Loader from "./Loader.js";

// Redux
import { MessageActions } from "~/redux/message";
import icons from "~/config/themes/icons";

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

  componentWillReceiveProps(nextProps) {
    let { messageActions, message } = this.props;
    if (
      nextProps.message.show &&
      this.props.message.show !== nextProps.message.show
    ) {
      if (nextProps.message.clickoff) {
        document.addEventListener("touchstart", this.eventListen, true);
        document.addEventListener("click", this.eventListen, true);
      } else if (!nextProps.message.load) {
        this.popupMessageTimeout = setTimeout(() => {
          messageActions.showMessage({ show: false });
        }, message.timeout);
      }
    }
  }

  render() {
    let { message } = this.props;
    return (
      <div className={css(styles.popupMessage, !message.show && styles.hide)}>
        {message.load ? (
          <Loader loading={true} />
        ) : (
          <span
            style={inlineStyle.check}
            className={"far fa-times"}
            color="#fff"
          >
            {message.error ? icons.times : icons.check}
          </span>
        )}
        {!message.load && (
          <div className={css(styles.message)}>{message.message}</div>
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
    zIndex: 999999,
    whiteSpace: "pre-wrap",
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);
