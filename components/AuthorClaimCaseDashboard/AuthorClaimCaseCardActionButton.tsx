import {
  AUTHOR_CLAIM_ACTION_LABEL,
  AUTHOR_CLAIM_STATUS,
} from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { ValueOf } from "../../config/types/root_types";
import { ReactElement, SyntheticEvent } from "react";
import colors from "../../config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

type Props = {
  actionType: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
  isDisabled: boolean;
  index: number;
  onClick: (event: SyntheticEvent) => void;
};

const getButtonStyle = (actionType: ValueOf<typeof AUTHOR_CLAIM_STATUS>) => {
  return actionType === AUTHOR_CLAIM_STATUS.APPROVED
    ? styles.buttonApprove
    : styles.buttonDisapprove;
};

export default function AuthorClaimCaseCardActionButton({
  actionType,
  isDisabled,
  index,
  onClick,
}: Props): ReactElement<"div"> {
  const buttonLabel = AUTHOR_CLAIM_ACTION_LABEL[actionType];
  return (
    <div
      className={css(
        styles.authorClaimCaseCardActionButton,
        getButtonStyle(actionType),
        isDisabled ? styles.disableButton : null,
        index === 0 && styles.firstCard
      )}
      onClick={onClick}
      role="button"
    >
      {buttonLabel}
    </div>
  );
}

const styles = StyleSheet.create({
  firstCard: {
    marginLeft: 0,
  },
  authorClaimCaseCardActionButton: {
    alignItems: "center",
    borderRadius: 4,
    cursor: "pointer",
    display: "flex",
    height: 44,
    justifyContent: "center",
    marginLeft: 8,
    width: 144,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "50%",
    },
  },
  buttonApprove: {
    backgroundColor: colors.NEW_BLUE(1),
    border: `1px solid ${colors.NEW_BLUE(1)}`,
    color: "#fff",
  },
  buttonDisapprove: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.NEW_BLUE(1)}`,
  },
  disableButton: {
    backgroundColor: colors.GREY(1),
    border: "none",
    cursor: "wait",
  },
});
