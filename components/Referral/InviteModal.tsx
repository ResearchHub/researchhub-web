import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-light-svg-icons";
import { faPaperPlane } from "@fortawesome/pro-duotone-svg-icons";
import { faLink } from "@fortawesome/pro-solid-svg-icons";
import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import { useRef, useState } from "react";
import colors from "~/config/themes/colors";
import ALink from "../ALink";
import AuthorAvatar from "../AuthorAvatar";
import InviteIcon from "../Icons/InviteIcon";

import { breakpoints } from "~/config/themes/screen";
import { ID, NullableString, UnifiedDocument } from "~/config/types/root_types";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import Button from "../Form/Button";
import Loader from "../Loader/Loader";
import { MessageActions } from "~/redux/message";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import { captureEvent } from "~/config/utils/events";

type Args = {
  isOpen: boolean;
  handleClose: Function;
  user: any;
  context: "bounty" | "referral";
  unifiedDocument?: UnifiedDocument;
};

type sendInviteApiArgs = {
  email: String;
  firstName: NullableString;
  lastName: NullableString;
  inviteType: "BOUNTY" | "JOIN_RH";
  unifiedDocumentId?: ID;
};

const InviteModal = ({
  isOpen,
  handleClose,
  user,
  context,
  unifiedDocument,
}: Args) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const formInputRef = useRef<HTMLInputElement>();
  const firstNameInputRef = useRef<HTMLInputElement>();
  const lastNameInputRef = useRef<HTMLInputElement>();
  const [copySuccessMessage, setCopySuccessMessage] =
    useState<NullableString>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"LINK" | "EMAIL">("LINK");
  const [email, setEmail] = useState<String>("");
  const [firstName, setFirstName] = useState<NullableString>("");
  const [lastName, setLastName] = useState<NullableString>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e?.key === 13 /*Enter*/) {
      sendInviteApi({
        inviteType: context == "bounty" ? "BOUNTY" : "JOIN_RH",
        email,
        firstName,
        lastName,
      });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (email.length > 0) {
      sendInviteApi({
        inviteType: context == "bounty" ? "BOUNTY" : "JOIN_RH",
        email,
        firstName,
        lastName,
      });
    }
  };

  const sendInviteApi = async ({
    email,
    inviteType,
    firstName,
    lastName,
  }: sendInviteApiArgs) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        API.SEND_REFERRAL_INVITE(),
        API.POST_CONFIG({
          recipient_email: email,
          invite_type: inviteType,
          ...(firstName && { referral_first_name: firstName }),
          ...(lastName && { referral_last_name: lastName }),
          ...(unifiedDocument && { unified_document: unifiedDocument.id }),
        })
      );

      const body = await response.json();
      if (!body.id) {
        dispatch(
          MessageActions.setMessage(body.message || "Failed to send invite")
        );
        // @ts-ignore
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      } else {
        dispatch(MessageActions.setMessage("Invite sent"));
        // @ts-ignore
        dispatch(MessageActions.showMessage({ show: true, error: false }));
        setEmail("");
        setFirstName("");
        setLastName("");
      }
    } catch (error) {
      dispatch(MessageActions.setMessage("Failed to send invite"));
      // @ts-ignore
      dispatch(MessageActions.showMessage({ show: true, error: true }));

      captureEvent({
        error,
        msg: "Failed to invite user",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    (<BaseModal
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
      <div className={css(styles.divider)}></div>
      {context === "bounty" ? (
        <p className={css(styles.details, styles.detailsBounty)}>
          <strong>Know someone who can complete this bounty?</strong> You will
          earn a 7% bonus for every contribution they make for six months.
        </p>
      ) : (
        <p className={css(styles.details)}>
          Just share this link, or enter your friend’s email address and name
          below.
        </p>
      )}
      <div className={css(styles.referralLinkSection)}>
        <div className={css(styles.tabs)}>
          <div
            className={css(
              styles.tab,
              selectedTab === "LINK" && styles.tabSelected
            )}
            onClick={() => setSelectedTab("LINK")}
          >
            <span className={css(styles.tabIcon)}>
              {<FontAwesomeIcon icon={faLink}></FontAwesomeIcon>}
            </span>{" "}
            Invite by link
          </div>
          <div
            onClick={() => setSelectedTab("EMAIL")}
            className={css(
              styles.tab,
              selectedTab === "EMAIL" && styles.tabSelected
            )}
          >
            <span className={css(styles.tabIcon)}>
              {<FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>}
            </span>{" "}
            Invite by email
          </div>
          <div className={css(styles.invitesSent)}>
            <ALink href="/referral" overrideStyle={styles.link}>
              View invites sent
            </ALink>
          </div>
        </div>
        {selectedTab === "LINK" && (
          <div className={css(styles.howItWorksSection)}>
            {user?.id ? (
              <div className={css(styles.form)}>
                <FormInput
                  getRef={formInputRef}
                  onClick={copyToClipboard}
                  inlineNodeRight={
                    <a
                      className={css(styles.copyLink)}
                      onClick={copyToClipboard}
                    >
                      {showSuccessMessage ? (
                        "Copied"
                      ) : (
                        <span className={css(styles.copyIcon)}>
                          {<FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>}
                        </span>
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
                  inputStyle={[styles.inputStyle, styles.referralInputStyle]}
                />
              </div>
            ) : (
              <div>Login first to view your personalized link</div>
            )}
          </div>
        )}
        {selectedTab === "EMAIL" && (
          <div className={css(styles.howItWorksSection)}>
            {user?.id ? (
              <div>
                <form
                  // onSubmit={(e) => handleSubmit(e)}
                  className={css(styles.emailForm)}
                >
                  <div className={css(styles.referralEmailInput)}>
                    <FormInput
                      value={email}
                      getRef={formInputRef}
                      required
                      containerStyle={styles.containerStyle}
                      inputStyle={styles.inputStyle}
                      type="email"
                      placeholder="Email"
                      onKeyDown={handleKeyDown}
                      onChange={(id, value) => setEmail(value)}
                    />
                  </div>
                  <div className={css(styles.referralNameInput)}>
                    <div className={css(styles.referralFirstNameInput)}>
                      <FormInput
                        value={firstName}
                        getRef={firstNameInputRef}
                        required
                        containerStyle={styles.containerStyle}
                        inputStyle={styles.inputStyle}
                        placeholder="First name (optional)"
                        onKeyDown={handleKeyDown}
                        onChange={(id, value) => setFirstName(value)}
                      />
                    </div>
                    <div className={css(styles.referralLastNameInput)}>
                      <FormInput
                        value={lastName}
                        getRef={lastNameInputRef}
                        required
                        containerStyle={styles.containerStyle}
                        inputStyle={styles.inputStyle}
                        placeholder="Last name (optional)"
                        onKeyDown={handleKeyDown}
                        onChange={(id, value) => setLastName(value)}
                      />
                    </div>
                  </div>
                  <div className={css(styles.referralBtnWrapper)}>
                    {isLoading ? (
                      <Button
                        onClick={handleSubmit}
                        children={<Loader color="white" size={24} />}
                        customButtonStyle={styles.inviteBtn}
                      />
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        label="Send invite"
                        customButtonStyle={styles.inviteBtn}
                      />
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div>Login first in order to invite others</div>
            )}
          </div>
        )}
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
            <li>Share your referral link</li>
            <li>
              Earn{" "}
              <span
                style={{
                  color: colors.ORANGE_DARK2(),
                  fontWeight: 500,
                }}
              >
                7%
              </span>{" "}
              of user's RSC earnings on ResearchHub for the first six month
              period
              <div className={css(styles.example)}>
                Example: If they earn 100 RSC, you will earn 7 RSC
              </div>
            </li>
          </ol>
          ={" "}
        </div>
      </div>
    </BaseModal>)
  );
};

const styles = StyleSheet.create({
  invitesSent: {
    marginLeft: "auto",
    alignSelf: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  referralEmailInput: {
    display: "flex",
    flexDirection: "row",
  },
  referralBtnWrapper: {
    height: 50,
    display: "flex",
    marginTop: 15,
  },
  authorNameTitle: {
    marginBottom: 0,
    marginTop: 15,
  },
  engagementDetails: {
    marginBottom: 0,
    marginTop: 0,
  },
  referralNameInput: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
  },
  referralFirstNameInput: {
    width: "50%",
    marginRight: 15,
  },
  referralLastNameInput: {
    width: "50%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "46%",
    },
  },
  inviteBtn: {
    height: "100%",
    borderRadius: "0px",
  },
  emailForm: {
    display: "flex",
    columnGap: "0px",
    flexDirection: "column",
  },
  tabs: {
    display: "flex",
    marginBottom: 15,
  },
  tabIcon: {
    fontSize: 16,
  },
  tab: {
    padding: `9px 15px`,
    border: `1px solid ${colors.GREY_LINE()}`,
    position: "relative",
    cursor: "pointer",
    color: colors.BLACK(0.7),
    marginRight: 0,
    ":first-child": {
      borderRadius: "4px 0px 0px 4px",
    },
    ":last-child": {
      borderRadius: "0px 4px 4px 0px",
      marginLeft: -1,
    },
    ":hover": {
      background: `${colors.LIGHTER_GREY(0.5)}`,
      transition: "0.5s",
    },
  },
  tabSelected: {
    color: colors.NEW_BLUE(),
    zIndex: 2,
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
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
    marginBottom: 0,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
      paddingLeft: 20,
    },
  },
  userIcon: {
    fontSize: 30,
    color: colors.MEDIUM_GREY2(),
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
    cursor: "pointer",
  },
  referralInputStyle: {
    paddingRight: 80,
  },
  copyLink: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontWeight: 500,
  },
  copyIcon: {
    fontSize: 22,
    zIndex: 3,
    background: "white",
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
