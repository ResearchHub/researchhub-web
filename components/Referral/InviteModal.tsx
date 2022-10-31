import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import { useRef, useState } from "react";
import colors from "~/config/themes/colors";
import ALink from "../ALink";
import AuthorAvatar from "../AuthorAvatar";
import InviteIcon from "../Icons/InviteIcon";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { NullableString } from "~/config/types/root_types";
import ReactTooltip from "react-tooltip";

type Args = {
  isOpen: boolean;
  handleClose: Function;
  user: any;
  context: "bounty" | "referral";
};

const InviteModal = ({ isOpen, handleClose, user, context }: Args) => {
  const formInputRef = useRef<HTMLInputElement>();
  const [copySuccessMessage, setCopySuccessMessage] =
    useState<NullableString>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  function copyToClipboard() {
    setShowSuccessMessage(true);
    formInputRef!.current!.select();
    document.execCommand("copy");
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
      titleStyle={styles.titleStyle}
      textAlign="left"
      title={
        context === "bounty"
          ? `Invite others to answer this bounty`
          : `Invite others to ResearchHub`
      }
    >
      <ReactTooltip />
      <div className={css(styles.divider)}></div>
      {context === "bounty" ? (
        <p className={css(styles.details, styles.detailsBounty)}>
          <strong>Know someone who can answer this bounty?</strong> You could
          earn a 7% bonus based on this bounty and for every contribution they
          make for six months.
        </p>
      ) : (
        <p className={css(styles.details)}>
          Get rewarded for referring scientists and reserachers to our platform.
        </p>
      )}
      <div className={css(styles.referralLinkSection)}>
        <h4 className={css(styles.sectionTitle)}>
          Your referral link
          <span onClick={() => handleClose()}>
            <ALink href="/referral" overrideStyle={styles.link}>
              View invites
            </ALink>
          </span>
        </h4>
        <FormInput
          getRef={formInputRef}
          onClick={copyToClipboard}
          inlineNodeRight={
            <a className={css(styles.copyLink)} onClick={copyToClipboard}>
              {showSuccessMessage ? (
                "Copied"
              ) : (
                <span className={css(styles.copyIcon)}>{icons.copy}</span>
              )}
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
          <ALink
            href="https://researchhub.notion.site/ResearchHub-Referral-Program-67f25909a320432eb1071078084bf5b9"
            overrideStyle={styles.link}
            target="_blank"
          >
            FAQs
          </ALink>
        </h4>
        <div className={css(styles.highlightedSection)}>
          <ol className={css(styles.highlightedSectionList)}>
            <li>Share your referral link person of interest</li>
            <li>
              Earn{" "}
              <span
                style={{
                  color: colors.ORANGE_DARK2(),
                  fontWeight: 500,
                  borderBottom: "2px dotted",
                }}
                data-tip="7% bonus will be paid by ResearchHub and not referral"
              >
                7% bonus
              </span>{" "}
              every time they earn RSC on ResearchHub for the first six month
              period
              <div className={css(styles.example)}>
                Example: You will recieve 7 RSC if they earn 100 RSC
              </div>
            </li>
          </ol>
          <div className={css(styles.squaresContainer)}>
            <div className={css(styles.square)}>
              <div className={css(styles.iconContainer)}>
                <AuthorAvatar author={user.author_profile} />
              </div>
              <span className={css(styles.personTitle)}>You</span>
              <span className={css(styles.subtitle)}>
                <span className={css(styles.emphasizedEarn)}>+7% RSC</span>{" "}
                bonus for first six months
              </span>
            </div>
            <div className={css(styles.square)}>
              <div className={css(styles.iconContainer)}>
                <InviteIcon />
              </div>
              <span className={css(styles.personTitle)}>Invitee</span>
              <span className={css(styles.subtitle)}>
                <span className={css(styles.emphasizedEarn)}>+50 RSC</span> on
                sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  example: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 14,
  },
  divider: {
    width: "100%",
    borderTop: `1px solid ${colors.GREY_LINE()}`,
    marginTop: 5,
  },
  squaresContainer: {
    display: "flex",
    columnGap: "15px",
  },
  highlightedSectionList: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
      paddingLeft: 20,
    },
  },
  details: {
    textAlign: "left",
    fontWeight: 400,
    width: "100%",
    marginBottom: 35,
    marginTop: 10,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
    },
  },
  detailsBounty: {
    padding: 15,
    background: colors.NEW_BLUE(0.1),
    border: `2px solid ${colors.NEW_BLUE(0.7)}`,
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  sectionTitle: {
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.NEW_BLUE(),
  },
  emphasizedEarn: {
    color: colors.ORANGE_DARK2(),
    fontWeight: 500,
  },
  iconContainer: {
    height: 34,
  },
  highlightedSection: {
    backgroundColor: colors.ICY_GREY,
    padding: 15,
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
    },
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
    borderRadius: "4px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingLeft: 15,
      paddingRight: 15,
      padding: 10,
    },
  },
  modalStyle: {
    width: 650,
    padding: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "90%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "100%",
    },
  },
  modalContentStyle: {
    padding: 25,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      padding: 5,
      paddingTop: 25,
    },
  },
  titleStyle: {
    height: "auto",
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
    margin: "0 auto",
  },
  copySuccessMessageStyle: {
    position: "absolute",
    right: -70,
    top: "50%",
    color: "white",
    transform: "translateY(-50%)",
  },
  inlineNodeStyles: {
    paddingRight: 0,
    right: 16,
  },
});

export default InviteModal;
