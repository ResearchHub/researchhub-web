import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import FormInput from "~/components/Form/FormInput";

import colors from "~/config/themes/colors";

const ShareModal = (props) => {
  const { close, isOpen, title, subtitle, url } = props;
  const [formInputRef, setFormInputRef] = useState();
  const [copySuccessMessage, setCopySuccessMessage] = useState(null);

  function copyToClipboard() {
    formInputRef.select();
    document.execCommand("copy");
    // e.target.focus(); // TODO: Uncomment if we don't want highlighting
    setCopySuccessMessage("Copied!");
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={close}
      className={css(styles.modal)}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
      style={overlayStyles}
      ariaHideApp={false} // TODO: Set as true and add appElement
    >
      <div className={css(styles.modalContent)}>
        <img
          src={"/static/icons/close.png"}
          className={css(styles.closeButton)}
          onClick={close}
        />
        <div className={css(styles.titleContainer)}>
          <div className={css(styles.title, styles.text)}>{title}</div>
          <div className={css(styles.subtitle, styles.text)}>{subtitle}</div>
        </div>
        <FormInput
          getRef={setFormInputRef}
          inlineNodeRight={<CopyLink onClick={copyToClipboard} />}
          value={url}
          message={copySuccessMessage}
        />
      </div>
    </Modal>
  );
};

ShareModal.propTypes = {
  close: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.any,
  subtitle: PropTypes.any,
  url: PropTypes.string,
};

const CopyLink = (props) => {
  const { onClick } = props;
  return (
    <a className={css(styles.copyLink)} onClick={onClick}>
      Copy link
    </a>
  );
};

export default ShareModal;

const overlayStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: "11",
    borderRadius: 5,
  },
};

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
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: "50px 0px 50px 0px",
    width: 625,
    height: "100%",
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
    marginBottom: 30,
  },
  noMargin: {
    marginBottom: 0,
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: 426,
    fontSize: 26,
    color: "#232038",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
  },
  text: {
    fontFamily: "Roboto",
  },
  button: {
    height: 55,
    width: 230,
    marginBottom: 15,
  },
  iconStyle: {
    height: 33,
    width: 33,
  },
  inputContainer: {
    width: 425,
    marginTop: 0,
    marginBottom: 30,
  },
  input: {
    width: 395,
  },
  copyLink: {
    color: colors.PURPLE(),
  },
});
