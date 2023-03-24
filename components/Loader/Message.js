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
        }, message.timeout || 2000);
      }
    }
  }

  render() {
    let { message } = this.props;
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
            <Loader loading={true} />
          </div>
        ) : (
          <span style={inlineStyle.check} color="#fff">
            {message.error ? (
              <i className="fa-light fa-times"></i>
            ) : (
              <i className="fa-solid fa-check"></i>
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
    zIndex: 999999,
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
