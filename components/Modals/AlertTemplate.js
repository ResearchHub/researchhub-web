import Modal from "react-modal";
import { StyleSheet, css } from "aphrodite";
import { modalStyles } from "~/config/themes/styles";
import Ripples from "react-ripples";

const AlertTemplate = ({ style, options, message, close }) => {
  const withCancel =
    options.withCancel !== undefined ? options.withCancel : true;

  function closeAlert() {
    close();
  }

  function getOverlayStyle() {
    return {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        zIndex: "1000005",
        borderRadius: 5,
      },
    };
  }

  return (
    <Modal
      className={css(modalStyles.modal)}
      isOpen={true}
      closeModal={closeAlert}
      shouldCloseOnOverlayClick={true}
      onRequestClose={closeAlert}
      style={getOverlayStyle()}
      ariaHideApp={false}
    >
      <div className={css(styles.alertContainer)}>
        <p className={css(styles.text)}>{message.text}</p>
        <div className={css(styles.buttonRow)}>
          {withCancel && (
            <Ripples
              className={css(styles.button, styles.border)}
              onClick={closeAlert}
            >
              <div className={css(styles.left)}>Cancel</div>
            </Ripples>
          )}
          <Ripples
            className={css(styles.button)}
            onClick={() => {
              message.onClick && message.onClick();
              close();
            }}
          >
            <div>{message.buttonText}</div>
          </Ripples>
        </div>
      </div>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 257,
    maxWidth: 400,
    border: "1px solid #F3F3F8",
    backgroundColor: "#FFF",
    boxSizing: "border-box",
  },
  text: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: 80,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.6,
    padding: "10px 25px",
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    borderTop: "1px solid #EEEEEE",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    fontFamily: "Roboto",
    fontSize: 14,
    height: 58,
    width: "50%",
    boxSizing: "border-box",
    textTransform: "uppercase",
    color: "#065FD4",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  border: {
    borderRight: "1px solid #EEEEEE",
  },
  left: {
    color: "#606060",
  },
});

export default AlertTemplate;
