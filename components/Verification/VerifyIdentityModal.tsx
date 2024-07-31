import withWebSocket from "~/components/withWebSocket";
import AddPublicationsForm, {
  STEP as PUBLICATION_STEP,
} from "../Author/Profile/AddPublicationsForm";
import { useEffect, useState } from "react";
import {
  Notification,
  parseNotification,
} from "~/components/Notifications/lib/types";
import BaseModal from "../Modals/BaseModal";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import { StyleSheet, css } from "aphrodite";
import { connect, useSelector } from "react-redux";
import Button from "../Form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCheck,
  faUser,
  faWarning,
} from "@fortawesome/pro-solid-svg-icons";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import VerifyIdentityBreadcrumbs, {
  ProgressStepperStep,
} from "../shared/ProgressStepper";
import VerifiedBadge from "./VerifiedBadge";
import ALink from "../ALink";
import Image from "next/image";
import { PaperIcon } from "~/config/themes/icons";
import {
  faArrowLeft,
  faInfo,
  faInfoCircle,
  faUserGroup,
  faUserGraduate,
} from "@fortawesome/pro-light-svg-icons";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { useRouter } from "next/router";
import IconButton from "../Icons/IconButton";

interface Props {
  wsResponse: any;
  children: any;
}

export type STEP =
  | "INTRO"
  | "IDENTITY"
  | "IDENTITY_VERIFIED_SUCCESSFULLY"
  | "IDENTITY_CANNOT_BE_VERIFIED"
  | "PUBLICATIONS"
  | "SUCCESS";

const stepperSteps: ProgressStepperStep[] = [
  {
    title: "Verify Identity",
    number: 1,
    value: "IDENTITY",
  },
  {
    title: "Publication History",
    number: 2,
    value: "PUBLICATIONS",
  },
  {
    title: "View Rewards",
    number: 3,
    value: "SUCCESS",
  },
];

const VerificationWithPersonaStep = dynamic(
  () => import("./VerificationWithPersonaStep"),
  {
    ssr: false,
  }
);

const VerifyIdentityModal = ({ wsResponse, children }: Props) => {
  const [step, setStep] = useState<STEP>("INTRO");
  const [publicationsSubstep, setPublicationsSubstep] =
    useState<PUBLICATION_STEP>("DOI");
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsReceived, setNotificationsReceived] = useState<
    Notification[]
  >([]);
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!wsResponse) return;

    try {
      const incomingNotification = parseNotification(wsResponse);
      setNotificationsReceived([
        ...notificationsReceived,
        incomingNotification,
      ]);

      if (incomingNotification.type === "IDENTITY_VERIFICATION_UPDATED") {
        if (incomingNotification.raw?.extra?.status === "APPROVED") {
          setStep("IDENTITY_VERIFIED_SUCCESSFULLY");
        } else {
          setStep("IDENTITY_CANNOT_BE_VERIFIED");
        }
      }
    } catch (e) {
      console.error(`Failed to parse notification: ${e}`);
    }
  }, [wsResponse]);

  const handleStepChangeOfPublicationsFlow = ({ step }) => {
    setPublicationsSubstep(step);

    if (step === "FINISHED") {
      setIsOpen(false);
      router.push(
        "/author/[authorId]",
        `/author/${currentUser?.authorProfile.id}`
      );
    }
  };


  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <BaseModal
        isOpen={isOpen}
        hideClose={false}
        closeModal={() => {
          setIsOpen(false);
        }}
        zIndex={1000000}
        modalContentStyle={step === "INTRO" ? styles.introModalStyle : styles.modalStyle}
        titleStyle={styles.modalTitle}
      >
        <>
          {!["INTRO", "IDENTITY", "IDENTITY_VERIFIED_SUCCESSFULLY"].includes(step) && (
            <div className={css(styles.breadcrumbsWrapper)}>
              <VerifyIdentityBreadcrumbs
                selected={
                  step === "IDENTITY_VERIFIED_SUCCESSFULLY" ? "IDENTITY" : step
                }
                steps={stepperSteps}
              />
            </div>
          )}
          <div className={css(styles.body)}>
            {step === "INTRO" && (
              <div style={{ marginTop: 25 }}>
                <div className={css(styles.badgeWrapper)}>
                  <VerifiedBadge height={50} width={50} />
                </div>
                <div className={css(styles.title, styles.introTitle)}>
                  Verify identity to unlock new features
                </div>
                <div className={css(styles.description, styles.introDescription)}>
                  <p>
                    (Takes 1-3 minutes)

                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 15, }}>
                  <div style={{ width: "50%"}}>
                    <div className={css(styles.sectionTitle)}>
                      <FontAwesomeIcon icon={faUserGroup} style={{ color: "white", }} fontSize={30} />
                      All users
                    </div>
                    <ul className={css(styles.list)}>
                      <li className={css(styles.listItem)}>
                        <div className={css(styles.icon)}>
                          <FontAwesomeIcon icon={faCheck} style={{ color: "white"}} fontSize={18} />
                        </div>
                        Verified badge
                      </li>
                      <li className={css(styles.listItem)}>
                        <div className={css(styles.icon)}>
                          <FontAwesomeIcon icon={faCheck} style={{ color: "white"}} fontSize={18} />
                        </div>
                        Faster withdrawl limits
                      </li>
                    </ul>
                  </div>
                  <div style={{ width: "50%"}}>
                    <div className={css(styles.sectionTitle)}>
                      <FontAwesomeIcon icon={faUserGraduate} style={{ color: "white", }} fontSize={30} />
                      Published authors
                    </div>
                    <ul className={css(styles.list)}>
                      <li className={css(styles.listItem)}>
                        <div className={css(styles.icon)}>
                          <FontAwesomeIcon icon={faCheck} style={{ color: "white"}} fontSize={18} />
                        </div>                        
                        Claim RSC rewards on papers
                      </li>
                      <li className={css(styles.listItem)}>
                        <div className={css(styles.icon)}>
                          <FontAwesomeIcon icon={faCheck} style={{ color: "white"}} fontSize={18} />
                        </div>                        
                        Hub-specific reputation score will be calculated for you
                      </li>
                    </ul>
                  </div>                  

                </div>
                
                <div className={css(styles.startButtonWrapper)}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setStep("IDENTITY")}
                  >
                    Start
                  </Button>
                </div>
              </div>
            )}
            <div style={{ display: step === "IDENTITY" ? "block" : "none" }}>
              <VerificationWithPersonaStep />
            </div>
            {step === "IDENTITY_VERIFIED_SUCCESSFULLY" && (
              <div
                style={{
                  marginTop: 25,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 400,
                }}
              >
                <div>
                  <div className={css(styles.badgeWrapper)}>
                    <VerifiedBadge height={75} width={75} />
                  </div>
                  <div className={css(styles.title)} style={{ marginTop: 25 }}>
                    Identity has been verified successfully
                  </div>
                  <div className={css(styles.description)}>
                    A Verified badge will now appear next to your name
                    throughout the platform.
                  </div>
                </div>
                <div className={css(styles.startButtonWrapper)} style={{ gap: 10, display: "flex", flexDirection: "column"}}>
                  <Button
                    fullWidth
                    onClick={() => setStep("PUBLICATIONS")}
                    style={{ width: 200, margin: "20px auto" }}
                  >
                    Next: View rewards on my publications
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    theme="solidPrimary"
                    onClick={() => router.push("/author/[authorId]", `/author/${currentUser?.authorProfile.id}`)}
                    style={{ width: 200, margin: "20px auto" }}
                  >
                    View my profile
                  </Button>                  
                </div>
              </div>
            )}
            {step === "IDENTITY_CANNOT_BE_VERIFIED" && (
              <div style={{ marginTop: 25, justifyContent: "space-between" }}>
                <div
                  className={css(styles.title)}
                  style={{
                    marginTop: 25,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faWarning}
                      fontSize={75}
                      color={colors.MEDIUM_GREY2()}
                    />
                  </div>
                  <div style={{ marginTop: 25 }}>
                    Your identity cannot be verified at this time.
                  </div>
                </div>
                <div className={css(styles.description)}>
                  Please reach out to support at{" "}
                  <ALink href="mailto:verification@researchhub.com">
                    verification@researchhub.com
                  </ALink>
                </div>
                <div className={css(styles.startButtonWrapper)}>
                  <Button
                    fullWidth
                    onClick={() => setIsOpen(false)}
                    theme="solidPrimary"
                    style={{ width: 200, margin: "20px auto" }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
            {step === "PUBLICATIONS" && (
              <div
                className={css(styles.publicationsWrapper)}
                style={{
                  minHeight: publicationsSubstep === "RESULTS" ? 600 : "auto",
                }}
              >
                {publicationsSubstep === "DOI" && (
                  <div>
                    <div className={css(styles.title)}>
                      Let's find rewards on your publications
                    </div>
                    <div className={css(styles.description)}>
                      Enter a DOI for any paper you've published and we will
                      fetch the rest of your works.
                    </div>
                    <div className={css(styles.nextText)}>
                      What happens next
                    </div>
                    <div>
                      <div className={css(styles.lineItem)}>
                        <FontAwesomeIcon
                          fontSize={20}
                          icon={faUser}
                          color={colors.MEDIUM_GREY2()}
                        />
                        We will build your researcher profile
                      </div>
                      <div className={css(styles.lineItem)}>
                        <FontAwesomeIcon
                          fontSize={20}
                          icon={faChartLine}
                          color={colors.MEDIUM_GREY2()}
                        />
                        We will calculate your hub specific reputation
                      </div>
                      <div className={css(styles.lineItem)}>
                        <ResearchCoinIcon
                          version={4}
                          width={20}
                          height={20}
                          color={colors.MEDIUM_GREY2()}
                        />
                        We will identify your prior publications that are
                        eligible for rewards
                      </div>
                    </div>
                  </div>
                )}
                {publicationsSubstep === "RESULTS" && (
                  <div>
                    <div className={css(styles.title)}>
                      Review your publication history
                    </div>
                    <div className={css(styles.description)}>
                      We fetched some of your publications. We may have
                      mislabeled a paper or two so please select only the ones
                      that you have authored or co-authored.
                    </div>
                  </div>
                )}
                <div className={css(styles.formWrapper)}>
                  {/* @ts-ignore */}
                  <AddPublicationsForm
                    onStepChange={handleStepChangeOfPublicationsFlow}
                    allowDoThisLater
                    onDoThisLater={() => setIsOpen(false)}
                    // @ts-ignore legacy
                    wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
                    // @ts-ignore legacy
                    wsAuth
                  />
                </div>
                {publicationsSubstep === "LOADING" && (
                  <div style={{ marginTop: 60 }}>
                    <Button fullWidth onClick={() => setIsOpen(false)}>
                      Close popup
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 500,
    fontSize: 18,
    marginBottom: 15,
    color: "white",
    display: "flex",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom:10,
  },
  list: {
    paddingLeft: 0,
    fontSize: 16,
    lineHeight: 1.5,
    listStyleType: "none",
  },
  icon: {
  },
  listItem: {
    color: "white",
    display: "flex", 
    alignItems: "flex-start",
    gap: 8,
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  breadcrumbsWrapper: {
    marginTop: 20,
  },
  startButtonWrapper: {
    width: "100%",
    marginTop: 25,
    cursor: "pointer",
  },
  link: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontWeight: 400,
  },
  steps: {
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  stepIcon: {
    width: 40,
  },
  stepExplanation: {
    display: "flex",
    columnGap: "10px",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  publicationsWrapper: {
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    textAlign: "center",
  },
  introTitle: {
    color: "white",
  },
  description: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 18,
    width: "100%",
    textAlign: "center",
    margin: "10px auto 40px auto",
  },
  introDescription: {
    color: "white",
  },
  lineItem: {
    display: "flex",
    columnGap: "14px",
    marginBottom: 12,
    fontWeight: 400,
    color: colors.BLACK(),
    fontSize: 14,
    alignItems: "center",
  },
  body: {
    width: "100%",
    // minHeight: 650,
    maxWidth: 550,
  },
  formWrapper: {
    marginTop: 40,
  },
  nextText: {
    color: colors.MEDIUM_GREY2(),
    fontWeight: 500,
    textTransform: "uppercase",
    fontSize: 13,
    letterSpacing: "1.5px",
    marginBottom: 20,
  },
  modalStyle: {
    padding: "20px 20px",
    width: 550,
  },

  introModalStyle: {
    backgroundImage: "url('/static/background/small-banner-background.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",    
    padding: "10px 20px 20px 20px",
  },
  modalContentStyle: {
    padding: "10px 20px",
  },
  modalTitle: {},
  backButton: {
    position: "absolute",
    left: 10,
    top: 7,
    fontSize: 20,
    cursor: "pointer",
  },
  close: {
    position: "absolute",
    right: 10,
    top: 7,
    cursor: "pointer",
  },
  titleWrapper: {
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
  },
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
});

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(VerifyIdentityModal)
);
