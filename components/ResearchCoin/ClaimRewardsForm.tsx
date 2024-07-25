import { StyleSheet, css } from "aphrodite";

export type STEP =
  | "INTRO"
  | "OPEN_ACCESS"
  | "OPEN_DATA"
  | "PREREGISTRATION"
  | "CLAIM_SUBMITTED";

interface Props {
  onStepChange?: ({ step }: { step: STEP }) => void;
}

const ClaimRewardsForm = ({}: Props) => {
  return <div></div>;
};

const styles = StyleSheet.create({});

export default ClaimRewardsForm;
