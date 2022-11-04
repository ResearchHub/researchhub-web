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
import { ID, NullableString, UnifiedDocument } from "~/config/types/root_types";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import Button from "../Form/Button";
import Loader from "../Loader/Loader";
import { MessageActions } from "~/redux/message";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
type Args = {
  isOpen: boolean;
  handleClose: Function;
  user: any;
  context: "bounty" | "referral";
  unifiedDocument?: UnifiedDocument;
};

type sendInviteApiArgs = {
  email: String,
  inviteType: "BOUNTY" | "JOIN_RH",
  unifiedDocumentId?: ID,
}

const InviteModal = ({ isOpen, handleClose, user, context, unifiedDocument }: Args) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const formInputRef = useRef<HTMLInputElement>();
  const [copySuccessMessage, setCopySuccessMessage] =
    useState<NullableString>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"LINK"|"EMAIL">("LINK");
  const [email, setEmail] = useState<String>("");
  const [isLoading, setIsLoading] = useState(false);
  

  const handleKeyDown = (e) => {
    if (e?.key === 13 /*Enter*/) {
      sendInviteApi({ inviteType: context == "bounty" ? "BOUNTY" : "JOIN_RH", email });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (email.length > 0) {
      sendInviteApi({ inviteType: context == "bounty" ? "BOUNTY" : "JOIN_RH", email });
    }
  }

  const sendInviteApi = async ({ email, inviteType }: sendInviteApiArgs) => {
    setIsLoading(true);
    try {
      const response = await fetch(API.SEND_REFERRAL_INVITE(), API.POST_CONFIG({
        email,
        type: inviteType,
        ...(unifiedDocument && { unified_document_id: unifiedDocument.id }),
      }));

      const body = await response.json();
      if (body.error) {
        dispatch(MessageActions.setMessage( body.message ));  
        // @ts-ignore
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      }
      else {
        dispatch(MessageActions.setMessage( "Invite sent" ));
        // @ts-ignore
        dispatch(MessageActions.showMessage({ show: true, error: false }));      
        setEmail("");
      }

    }
    catch(error) {
      dispatch(MessageActions.setMessage( "Failed to send invite" ));
      // @ts-ignore
      dispatch(MessageActions.showMessage({ show: true, error: true }));      
    }
    finally {
      setIsLoading(false);      
    }
  }


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
      <div className={css(styles.divider)}></div>
      {context === "bounty" ? (
        <p className={css(styles.details, styles.detailsBounty)}>
          <strong>Know someone who can complete this bounty?</strong> You will earn a 7%
          bonus for every contribution they make for six months.
        </p>
      ) : (
        <p className={css(styles.details)}>
          Get rewarded for referring scientists and researchers to our platform.
        </p>
      )}

      <div className={css(styles.referralLinkSection)}>
        <div className={css(styles.tabs)}>
          <div
            className={css(styles.tab, selectedTab === "LINK" && styles.tabSelected)}
            onClick={() => setSelectedTab("LINK")}
          >
            <span className={css(styles.tabIcon)}>{icons.link}</span> Invite by link
          </div>
          <div
            onClick={() => setSelectedTab("EMAIL")}
            className={css(styles.tab, selectedTab === "EMAIL" && styles.tabSelected)}
          >
            <span className={css(styles.tabIcon)}>{icons.paperPlane}</span> Invite by email
          </div>
        </div>
        {/* <h4 className={css(styles.sectionTitle)}>
          Your referral link
          <span onClick={() => handleClose()}>
            <ALink href="/referral" overrideStyle={styles.link}>
              View invites
            </ALink>
          </span>
        </h4> */}
        {selectedTab === "LINK" &&
          <div className={css(styles.howItWorksSection)}>
            {user?.id ?
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
              : (
                <div>Login first to view your personalized link</div>
              )
            }
          </div>
        }
        {selectedTab === "EMAIL" &&
          <div className={css(styles.howItWorksSection)}>
            {user?.id ? (
              <div>
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  className={css(styles.emailForm)}
                >
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
                  {isLoading ? (
                    <Button
                      onClick={handleSubmit}
                      children={<Loader color="white" size={24} />}
                      customButtonStyle={styles.inviteBtn}
                    />                    
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      label="Invite"
                      customButtonStyle={styles.inviteBtn}
                    />
                  )}
                </form>                
              </div>
            ) : (
              <div>Login first in order to invite others</div>
            )}
          </div>
        }
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
                7% bonus
              </span>{" "}
              every time they earn RSC on ResearchHub for the first six month
              period
              <div className={css(styles.example)}>
                Example: If they earn 100 RSC, you will earn 7 RSC
              </div>
            </li>
          </ol>
          <div className={css(styles.squaresContainer)}>
            <div className={css(styles.square)}>
              <div className={css(styles.iconContainer)}>
                {user?.id
                  ? <AuthorAvatar author={user?.author_profile} />
                  : <div className={css(styles.userIcon)}>{icons.user}</div>
                }
                
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
              <span className={css(styles.personTitle)}>Referral</span>
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
  inviteBtn: {
    height: "100%",
    borderRadius: "0px",

  },
  emailForm: {
    display: "flex",
    columnGap: "0px",
  },
  tabs: {
    display: "flex",
    marginBottom: 15,
    justifyContent: "center",
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
    // background: colors.LIGHTER_GREY(1.0),
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
    // background: colors.NEW_BLUE(0.1),
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
