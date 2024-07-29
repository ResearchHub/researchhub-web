import { StyleSheet, css } from "aphrodite";
import BaseModal from "../Modals/BaseModal";
import colors from "~/config/themes/colors";
import { useEffect, useState } from "react";
import ProgressStepper, {
  ProgressStepperStep,
} from "../shared/ProgressStepper";
import Button from "../Form/Button";
import IconButton from "~/components/Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faInfoCircle as faInfoCircleLight,
} from "@fortawesome/pro-light-svg-icons";
import { submitRewardsClaim, fetchEligiblePaperRewards } from "./lib/api";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { ID } from "~/config/types/root_types";
import { Authorship } from "../Document/lib/types";
import { RewardSummary, parseRewardSummary } from "./lib/types";
import ClaimRewardSummary from "./lib/ClaimRewardSummary";
import FormInput from "../Form/FormInput";
import { isValidURL } from "~/config/utils/validation";

interface Props {
  isOpen: boolean;
  paperId: ID;
  paperTitle: string;
  authorship: Authorship | null;
  closeModal: () => void;
}

export type STEP =
  | "INTRO"
  | "OPEN_ACCESS"
  | "OPEN_DATA"
  | "PREREGRISTRATION"
  | "CLAIM_SUBMITTED"
  | "CLAIM_ERROR";

export const ORDERED_STEPS: STEP[] = [
  "INTRO",
  "OPEN_ACCESS",
  "OPEN_DATA",
  "PREREGRISTRATION",
  "CLAIM_ERROR",
];

const stepperSteps: ProgressStepperStep[] = [
  {
    title: "Open Access",
    number: 1,
    value: "OPEN_ACCESS",
  },
  {
    title: "Open Data",
    number: 2,
    value: "OPEN_DATA",
  },
  {
    title: "Preregistration",
    number: 3,
    value: "PREREGRISTRATION",
  },
];

const YesNoBlock = ({ selection, label, handleClick } : { selection: "YES" | "NO" | null, label: string, handleClick: Function }) => {
  return (
    <div className={css(blockStyles.yesNoBlock)}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between"}}>
        <div className={css(blockStyles.yesNoLabel)}>{label}</div>
        <div className={css(blockStyles.buttonsWrapper)}>
          <div className={css(blockStyles.btnWrapper)}>
            <Button fullWidth onClick={() => handleClick("YES")} variant={selection === "YES" ? "contained" : "outlined" }>
              Yes
            </Button>
          </div>
          <div className={css(blockStyles.btnWrapper)}>
            <Button fullWidth onClick={() => handleClick("NO")} variant={selection === "NO" ? "contained" : "outlined" }>
              No
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const blockStyles = StyleSheet.create({
  yesNoBlock: {
  },
  btnWrapper: {
    width: 100,
    
  },
  yesNoLabel: {
    maxWidth: 350,
  },
  buttonsWrapper: {
    display: "flex",
    gap: 10,
  }
})

const ClaimRewardsModal = ({
  paperId,
  paperTitle,
  authorship,
  isOpen,
  closeModal,
}: Props) => {
  const [step, setStep] = useState<STEP>("OPEN_DATA");
  const [openDataUrl, setOpenDataUrl] = useState<string | null>(null);
  const [preregistrationUrl, setPreregistrationUrl] = useState<string | null>(
    null
  );
  const [isOpenData, setIsOpenData] = useState<boolean | null>(null);
  const [isPreregistered, setIsPreregistered] = useState<boolean | null>(null);

  const currentUser = useCurrentUser();
  const [rewardSummary, setRewardSummary] = useState<RewardSummary | null>(
    null
  );

  const handleNext = () => {
    const currentStepPos = ORDERED_STEPS.indexOf(step);

    const isLastStep = (step === "PREREGRISTRATION");
    if (isLastStep) {
      handleSubmitClaim();
      return;
    }
    else {
      const nextStep = ORDERED_STEPS[currentStepPos + 1];
      setStep(nextStep);
    }
  }

  const handleSubmitClaim = () => {
    if (!currentUser) {
      return;
    }

    // @ts-ignore Temporarily ignoring due to hard-coding
    submitRewardsClaim({
      paperId,
      authorshipId: authorship!.id,
      userId: currentUser.id,
    });
  };

  useEffect(() => {
    (async () => {
      const response = await fetchEligiblePaperRewards({ paperId });
      const rewardSummary = parseRewardSummary(response);
      setRewardSummary(rewardSummary);
    })();
  }, []);

  const currentStepPos = ORDERED_STEPS.indexOf(step);
  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={false}
      closeModal={closeModal}
      zIndex={1000000}
      modalContentStyle={styles.modalStyle}
    >
      <div>
        {step !== "CLAIM_SUBMITTED" && (
          <div className={css(styles.breadcrumbsWrapper)}>
            <ProgressStepper selected={step} steps={stepperSteps} />
          </div>
        )}

        {currentStepPos > 0 && (
          <IconButton overrideStyle={styles.backButton}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => {
                const prevStep = ORDERED_STEPS[currentStepPos - 1];
                setStep(prevStep);
              }}
            />
          </IconButton>
        )}
        <div>Reward Summary: ${rewardSummary?.baseRewards}</div>
        <div>Authorship ID: {authorship?.id}</div>
        <div>Paper title: {paperTitle}</div>
        <div>Paper ID: {paperId}</div>

        {step === "INTRO" && (
          <>
            <div className={css(styles.slide)}>Intro placeholder</div>
          </>
        )}
        {step === "OPEN_ACCESS" && (
          <>
            <div className={css(styles.slide)}>Open Access placeholder</div>
          </>
        )}
        {step === "OPEN_DATA" && (
          <>
            <YesNoBlock
              selection={isOpenData ? "YES" : isOpenData === false ? "NO" : null}
              label="Is there an open data set freely and publicly available?"
              handleClick={(selection) => setIsOpenData(selection === "YES" ? true : false)}
            />
            <div style={{ display: isOpenData ? "block" : "none" }}>
              <FormInput
                error={
                  openDataUrl && !isValidURL(openDataUrl) && "Please enter a valid URL"
                }
                value={openDataUrl || ""}
                label="Provide the URL to the publication's dataset:"
                placeholder={"https://opendata.example.com"}
                containerStyle={styles.inputContainer}
                onChange={(name, value) => {
                  setOpenDataUrl(value.trim());
                }}
              />
            </div>
          </>
        )}
        {step === "PREREGRISTRATION" && (
          <>
            <div className={css(styles.slide)}>preregistration placeholder</div>
          </>
        )}

        <div>
          <ClaimRewardSummary
            baseReward={rewardSummary?.baseRewards || 0}
            isOpenAccess={true}
            isOpenData={openDataUrl !== null}
            isPreregistered={preregistrationUrl !== null}
            preregistrationMultiplier={rewardSummary?.preregistrationMultiplier}
            openDataMultiplier={rewardSummary?.openDataMultiplier}
          />
          <Button
            fullWidth
            onClick={() => handleNext()}
            theme="solidPrimary"
            style={{ width: 200, margin: "20px auto" }}
          >
            {step === "PREREGRISTRATION" ? "Submit" : step === "INTRO" ? "start" : "Next"}
          </Button>        
        </div>

      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  slide: {
    // minHeight: 300,
    textAlign: "center",
    fontSize: 18,
  },
  modalStyle: {
    padding: "20px 20px",
    width: 550,
  },
  modalContentStyle: {
    padding: "10px 20px",
  },
  breadcrumbsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 7,
    fontSize: 20,
    cursor: "pointer",
  },
});

export default ClaimRewardsModal;
