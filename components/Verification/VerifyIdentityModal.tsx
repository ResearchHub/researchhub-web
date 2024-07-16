import withWebSocket from "~/components/withWebSocket";
import AddPublicationsForm from "../Author/Profile/AddPublicationsForm";
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
import { faChartLine, faUser } from "@fortawesome/pro-solid-svg-icons";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import VerifyIdentityBreadcrumbs from "./VerifyIdentityBreadcrumbs";
import VerifiedBadge from "./VerifiedBadge";
import ALink from "../ALink";
import Image from "next/image";
import { PaperIcon } from "~/config/themes/icons";
import { faInfo, faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import {STEP as PUBLICATION_STEP} from "../Author/Profile/AddPublicationsForm";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { useRouter } from "next/router";

interface Props {
  wsResponse: any;
  children: any;
}

export type STEP = "INTRO" | "IDENTITY" | "PUBLICATIONS" | "SUCCESS";

const VerificationWithPersonaStep = dynamic(
  () => import("./VerificationWithPersonaStep"),
  {
    ssr: false,
  }
);

const VerifyIdentityModal = ({ wsResponse, children }: Props) => {
  const [step, setStep] = useState<STEP>("PUBLICATIONS");
  const [publicationsSubstep, setPublicationsSubstep] = useState<PUBLICATION_STEP>("LOADING");
  const [isOpen, setIsOpen] = useState(true);
  const [notificationsReceived, setNotificationsReceived] = useState<
    Notification[]
  >([]);
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const currentUser = useCurrentUser()


  useEffect(() => {
    if (!wsResponse) return;

    try {
      const incomingNotification = parseNotification(wsResponse);
      setNotificationsReceived([
        ...notificationsReceived,
        incomingNotification,
      ]);

      if (incomingNotification.type === "IDENTITY_VERIFIED") {
        // TODO: Send user to next step
      }
    } catch (e) {
      console.error(`Failed to parse notification: ${e}`);
    }
  }, [wsResponse]);

  const handleStepChangeOfPublicationsFlow = ({ step }) => {
    setPublicationsSubstep(step);

    if (step === "FINISHED") {
      setIsOpen(false);
      router.push("/author/[authorId]", `/author/${currentUser?.authorProfile.id}`);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset modal state
      setStep("PUBLICATIONS");
      setPublicationsSubstep("DOI");
    }
  }, [isOpen])

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
        modalContentStyle={styles.modalStyle}
        titleStyle={styles.modalTitle}
      >
        <>
          {step !== "INTRO" && (
            <VerifyIdentityBreadcrumbs step={step} />
          )}
          <div className={css(styles.body)}>
            {step === "INTRO" && (
              <div style={{ marginTop: 25, }}>

                <div className={css(styles.badgeWrapper)}>
                  <VerifiedBadge height={50} width={50} />
                </div>
                <div className={css(styles.title)}>
                  Verify identity to earn RSC rewards on your publications
                </div>
                <div className={css(styles.description)}>
                  First authors on Open Access papers are eligible for rewards. Earn rewards whenever your paper gets cited or upvoted.
                  <p style={{ marginTop: 10, }}>
                    <ALink theme={"solidPrimary"} href="/">Learn more about our reward algorithm</ALink>
                  </p>
                </div>

                <div className={css(styles.steps)}>
                  <div className={css(styles.stepExplanation)}>

                    <div className={css(styles.stepIcon)}>
                      <Image
                        alt="Scan"
                        width={36}
                        height={36}
                        src={"/static/icons/scan.svg"}
                      />
                    </div>

                    Step 1: Verify identity
                    <span className={css(styles.link)}>Why is this needed <FontAwesomeIcon icon={faInfoCircle} /></span>
                  </div>  
                  <div className={css(styles.stepExplanation)}>
                    <div className={css(styles.stepIcon)}>
                      <PaperIcon
                        width={30}
                        height={30}
                        color={"#AAA8B4"}
                        onClick={undefined}
                      />
                    </div>
                    Step 2: Verify identity
                  </div>
                  
                  <div className={css(styles.stepExplanation)}>
                    <div className={css(styles.stepIcon)}>
                      <ResearchCoinIcon
                        version={4}
                        width={28}
                        height={28}
                        color={"#AAA8B4"} />
                      </div>
                    Step 3: View rewards
                  </div>
                </div>
                <div className={css(styles.startButtonWrapper)}>
                  <Button
                    fullWidth
                    onClick={() => setStep("IDENTITY")}
                    theme="solidPrimary"
                    style={{ width: 200, margin: "20px auto", }}> 
                    Start
                    </Button>
                </div>
              </div>  
            )}
            <div style={{  display: step === "IDENTITY" ? "block" : "none" }}>
              <VerificationWithPersonaStep onComplete={({ status, inquiryId }) => 
                setStep("PUBLICATIONS")
              } />
            </div>
            {step === "PUBLICATIONS" && (
              <div className={css(styles.publicationsWrapper)} style={{ minHeight: publicationsSubstep === "RESULTS" ? 600 : "auto" }}>
              {publicationsSubstep === "DOI" && (
                <div>
                  <div className={css(styles.title)}>
                    Let's verify your publication history
                  </div>
                  <div className={css(styles.description)}>
                    Enter a DOI for any paper you've published and we will fetch
                    the rest of your works.
                  </div>
                  <div className={css(styles.nextText)}>What happens next</div>
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
                      We will identify your prior publications that are eligible
                      for rewards
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
                      We fetched some of your publications. We may have mislabeled a paper or two so please select only the ones that you have authored or co-authored.
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
                <div style={{ marginTop: 60, }}>
                  <Button fullWidth onClick={() => setIsOpen(false)}>Close popup</Button>
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
  startButtonWrapper: {
    width: "100%",
    marginTop: 25,
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
    justifyContent : "center",
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
  description: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 18,
    width: "100%",
    textAlign: "center",
    margin: "10px auto 40px auto",
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
