import React, { useState } from "react";
import Modal from "react-modal";
import { StyleSheet, css } from "aphrodite";
import { modalStyles } from "~/config/themes/styles";
import Ripples from "react-ripples";

const AlertTemplate = ({ style, options, message, close }) => {
  document.body.style.overflow = "hidden";

  function closeAlert() {
    document.body.style.overflow = "scroll";
    close();
  }

  return (
    <Modal
      className={css(modalStyles.modal)}
      isOpen={true}
      closeModal={closeAlert}
      shouldCloseOnOverlayClick={true}
      onRequestClose={closeAlert}
      style={modalStyles.overlay}
      ariaHideApp={false}
    >
      <div className={css(styles.alertContainer)}>
        <p className={css(styles.text)}>{message.text}</p>
        <div className={css(styles.buttonRow)}>
          <Ripples
            className={css(styles.button, styles.border)}
            onClick={closeAlert}
          >
            <div className={css(styles.left)}>Cancel</div>
          </Ripples>
          <Ripples
            className={css(styles.button)}
            onClick={() => {
              document.body.style.overflow = "scroll";
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
  modal: {
    background: "rgba(0, 0, 0, 0.2)",
  },
  alertContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 257,
    border: "1px solid #F3F3F8",
    backgroundColor: "#FFF",
    boxSizing: "border-box",
  },
  text: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
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
