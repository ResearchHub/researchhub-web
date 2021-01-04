import { StyleSheet, css } from "aphrodite";
import { useState, useRef } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import FormInput from "~/components/Form/FormInput";
import BaseModal from "../components/Modals/BaseModal";
import colors from "~/config/themes/colors";
import { RHLogo } from "~/config/themes/icons";

const ShareModal = (props) => {
  const { close, isOpen, title, subtitle, url } = props;
  // const [formInputRef, setFormInputRef] = useState();
  const [copySuccessMessage, setCopySuccessMessage] = useState(null);
  const formInputRef = useRef();

  function copyToClipboard() {
    formInputRef.current.select();
    document.execCommand("copy");
    // e.target.focus(); // TODO: Uncomment if we don't want highlighting
    setCopySuccessMessage("Copied!");
  }

  return (
    <BaseModal isOpen={isOpen} closeModal={close} title={title}>
      <FormInput
        getRef={formInputRef}
        inlineNodeRight={<CopyLink onClick={copyToClipboard} />}
        value={url}
        message={copySuccessMessage}
        containerStyle={styles.inputStyle}
      />
    </BaseModal>
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
    cursor: "pointer",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  logo: {
    height: 30,
    userSelect: "none",
  },
  inputStyle: {
    marginTop: 30,
    paddingRight: 80,
    width: 400,
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
});
