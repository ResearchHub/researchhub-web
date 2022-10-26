import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import { useRef, useState } from "react";
import colors from "~/config/themes/colors";
import ALink from "../ALink";
import AuthorAvatar from "../AuthorAvatar";
import InviteIcon from "../Icons/InviteIcon";
import icons from "~/config/themes/icons";


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
      titleStyle={styles.modalTitle}
      title={
        <div style={{textAlign: "left"}}>
          <div>{`Invite others to ResearchHub`}</div>
          <p style={{ textAlign: "left", fontWeight: 400, margin:0 }}>
            Get rewarded for referring scientists and reserachers to our platform.
          </p>          
       </div>
      }
    >
      <div className={css(styles.divider)}></div>

      <div className={css(styles.referralLinkSection)}>
        <h4 className={css(styles.sectionTitle)}>
          Your referral link
          <span onClick={() => handleClose()}>
            <ALink href="/referral" overrideStyle={styles.link}>View referral progress</ALink>
          </span>
        </h4>
        <FormInput
          getRef={formInputRef}
          onClick={copyToClipboard}
          inlineNodeRight={
            <a className={css(styles.copyLink)} onClick={copyToClipboard}>
              {showSuccessMessage ? "Copied!" : <span className={css(styles.copyIcon)}>{icons.copy}</span>}
            </a>
          }
          inlineNodeStyles={styles.inlineNodeStyles}
          messageStyle={[
            styles.copySuccessMessageStyle,
            !showSuccessMessage && styles.noShow,
          ]}
          value={
            process.browser
              ? `${window.location.protocol}//${window.location.host}/referral/${user.referral_code}`
              : ""
            }
          containerStyle={styles.containerStyle}
          inputStyle={styles.inputStyle}
        />
      </div>

      <div className={css(styles.howItWorksSection)}>
        <h4 className={css(styles.sectionTitle)}>
          How it works
          <ALink href="https://researchhub.notion.site/ResearchHub-Referral-Program-67f25909a320432eb1071078084bf5b9" overrideStyle={styles.link} target="_blank">FAQs</ALink>
        </h4>
        <div className={css(styles.highlightedSection)}>
          <ol>
            <li>Share your referral link with others</li>
            <li>Whenever invitee earns RSC on ReserachHub, you will receive a <span style={{color: colors.ORANGE_DARK2(), fontWeight: 500}}>7% bonus</span> for the first six month period</li>
          </ol>
          <div className={css(styles.squaresContainer)}>
            <div className={css(styles.square)}>
              <div className={css(styles.iconContainer)}>
                <AuthorAvatar author={user.author_profile} />
              </div>
              <span className={css(styles.personTitle)}>You</span>
              <span className={css(styles.subtitle)}><span className={css(styles.emphasizedEarn)}>+7% RSC</span> bonus for first six months</span>
            </div>
            <div className={css(styles.square)}>
              <div className={css(styles.iconContainer)}>
                <InviteIcon />
              </div>
              <span className={css(styles.personTitle)}>Invitee</span>
              <span className={css(styles.subtitle)}><span className={css(styles.emphasizedEarn)}>+50 RSC</span> on sign up</span>
            </div>          
          </div>
        </div>
      </div>



    </BaseModal>
  )
}

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    borderTop: `1px solid ${colors.GREY_LINE()}`,
    marginTop: 5,
    marginBottom: 35,
  },
  squaresContainer: {
    display: "flex",
    columnGap: "15px"
  },
  sectionTitle: {
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.NEW_BLUE(),
  },
  emphasizedEarn: {
    color: colors.ORANGE_DARK2(),
    fontWeight: 500,
  },
  iconContainer: {
    height: 34,
  },
  modalTitle: {
    height: "auto"
  },
  highlightedSection: {
    backgroundColor: colors.ICY_GREY,
    padding: 15
  },
  referralLinkSection: {
    width: "100%",
    marginBottom: 25,
  },
  howItWorksSection: {
    width: "100%",
  },
  personTitle: {
    fontWeight: 500,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.MEDIUM_GREY(),
  },
  square: {
    rowGap: "5px",
    padding: 15,
    alignItems: "center",
    textAlign: "center",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    border: `2px solid ${colors.GREY_LINE()}`,
    borderRadius: "4px"
  },
  modalStyle: {
    maxWidth: 650,
    padding: 15,
  },
  modalContentStyle: {
    padding: 25,
  },
  inputStyle: {
    paddingRight: 85,
    cursor: "pointer",
  },
  copyLink: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontWeight: 500,
  },
  copyIcon: {
    fontSize: 22,
  },
  noShow: {
    display: "none",
  },
  containerStyle: {
    paddingRight: "unset",
    minHeight: "unset",
    // width: 700,
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