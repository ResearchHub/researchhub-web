import withWebSocket from "~/components/withWebSocket";
import AddPublicationsForm from "../Author/Profile/AddPublicationsForm";
import { useEffect, useState } from "react";
import {
  Notification,
  parseNotification,
} from "~/components/Notifications/lib/types";
import BaseModal from "../Modals/BaseModal";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import { connect, useSelector } from "react-redux";
import Button from "../Form/Button";
import dynamic from "next/dynamic";

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
  const [step, setStep] = useState<STEP>("IDENTITY");
  const [isOpen, setIsOpen] = useState(false);
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
          {step === "IDENTITY" && (
            <VerificationWithPersonaStep
              nextStep={() => setStep("PUBLICATIONS")}
            />
          )}
          {step === "PUBLICATIONS" && (
            <div>
              {/* @ts-ignore legacy */}
              <AddPublicationsForm
                onStepChange={handleStepChangeOfPublicationsFlow}
              />
            </div>
          )}
        </>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    padding: "20px 20px",
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
