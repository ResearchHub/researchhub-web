import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import { useRef, useState } from "react";
import colors from "~/config/themes/colors";

type Args = {
  isOpen: boolean;
  handleClose: Function;
  user: any;
}

const InviteModal = ({ isOpen, handleClose, user }: Args) => {
  const formInputRef = useRef<HTMLInputElement>();
  const [copySuccessMessage, setCopySuccessMessage] = useState<null|string>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  function copyToClipboard() {
    setShowSuccessMessage(true);
    formInputRef!.current!.select();
    document.execCommand("copy");
    // e.target.focus(); // TODO: Uncomment if we don't want highlighting
    setCopySuccessMessage("Copied!");
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  }  

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      title={
       `Invite others to ResearchHub and earn ResearchCoin`
      }
    >

      <FormInput
        getRef={formInputRef}
        inlineNodeRight={
          <a className={css(styles.copyLink)} onClick={copyToClipboard}>
            {showSuccessMessage ? "Copied!" : "Copy Referral Link"}
          </a>
        }
        inlineNodeStyles={styles.inlineNodeStyles}
        messageStyle={[
          styles.copySuccessMessageStyle,
          !showSuccessMessage && styles.noShow,
        ]}
        value={`https://www.researchhub.com/referral/${user.referral_code}`}
        containerStyle={styles.containerStyle}
        inputStyle={styles.inputStyle}
      />


    </BaseModal>
  )
}

const styles = StyleSheet.create({
  modalStyle: {
    // maxWidth: 500,
    padding: 15,
  },
  modalContentStyle: {
    padding: 0,
    paddingTop: 25,
    paddingBottom: 25,
  },
  inputStyle: {
    paddingRight: 150,
  },
  copyLink: {
    color: colors.PURPLE(),
    cursor: "pointer",
    fontWeight: 500,
  },
  noShow: {
    display: "none",
  },
  containerStyle: {
    paddingRight: "unset",
    minHeight: "unset",
    width: 700,
    margin: "0 auto",
  },
  copySuccessMessageStyle: {
    position: "absolute",
    right: -70,
    top: "50%",
    color: "#fff",
    transform: "translateY(-50%)",
  },
  inlineNodeStyles: {
    paddingRight: 0,
    right: 16,
  },  
})

export default InviteModal;