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

const VerifyIdentityBreadcrumbs = ({ step }) => {
  return (
    <div className={css(s.breadcrumbs)}>
      <div className={css(s.step)}>
        <div className={css(s.num)}>
          <div>1</div>
        </div>
        <div>Verify Identity</div>
      </div>
      <div className={css(s.line)} style={{ marginRight: -11 }}></div>
      <div className={css(s.step)}>
        <div className={css(s.num, s.selectedStep)}>
          <div>2</div>
        </div>
        <div className={css(s.selectedStep)}>Publication History</div>
      </div>
      <div className={css(s.line)} style={{ marginLeft: -13 }}></div>
      <div className={css(s.step)}>
        <div className={css(s.num)}>
          <div>3</div>
        </div>
        <div>View Rewards</div>
      </div>
    </div>
  );
};

const s = StyleSheet.create({
  breadcrumbs: {
    display: "flex",
    justifyContent: "space-between",
    color: "#AAA8B4",
    alignItems: "center",
  },
  step: {
    fontSize: 12,
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  selectedStep: {
    borderColor: colors.NEW_BLUE(),
    color: colors.NEW_BLUE(),
  },
  line: {
    width: 34,
    height: 2,
    marginTop: -24,
    backgroundColor: "#DEDEE6",
  },
  num: {
    borderRadius: "50px",
    padding: 8,
    border: `1px solid ${colors.LIGHT_GREY()}`,
    fontSize: 16,
    fontWeight: 500,
    height: 16,
    width: 16,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
});

interface Props {
  wsResponse: any;
  children: any;
}

type STEP = "IDENTITY" | "PUBLICATIONS" | "SUCCESS";

const VerificationWithPersonaStep = dynamic(
  () => import("./VerificationWithPersonaStep"),
  {
    ssr: false,
  }
);

const VerifyIdentityModal = ({ wsResponse, children }: Props) => {
  const [step, setStep] = useState<STEP>("PUBLICATIONS");
  const [isOpen, setIsOpen] = useState(true);
  const [notificationsReceived, setNotificationsReceived] = useState<
    Notification[]
  >([]);

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
    // Handle this step
  };

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <BaseModal
        isOpen={isOpen}
        hideClose={true}
        closeModal={() => setIsOpen(false)}
        zIndex={1000000001}
        modalContentStyle={styles.modalStyle}
        titleStyle={styles.modalTitle}
      >
        <>
          <VerifyIdentityBreadcrumbs step={step} />
          <div className={css(styles.body)}>
            {step === "IDENTITY" && (
              <div>
                Placeholder for persona identity verification form
                <div>
                  <Button onClick={() => setStep("PUBLICATIONS")}>Next</Button>
                </div>
              </div>
            )}
            {step === "PUBLICATIONS" && (
              <>
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
                <div className={css(styles.formWrapper)}>
                  {/* @ts-ignore legacy */}
                  <AddPublicationsForm
                    onStepChange={handleStepChangeOfPublicationsFlow}
                    allowDoThisLater
                  />
                </div>
              </>
            )}
          </div>
        </>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 500,
    textAlign: "center",
  },
  description: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 18,
    width: 400,
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
  },
  body: {
    marginTop: 40,
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
    width: 500,
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
