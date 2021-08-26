import {
  AUTHOR_CLAIM_STATUS,
  AUTHOR_CLAIM_STATUS_LABEL,
} from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { ValueOf } from "../../config/types/root_types";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import { ReactElement } from "react";

type Props = {
  status: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
};

const getIcon = (status: ValueOf<typeof AUTHOR_CLAIM_STATUS>) => {
  switch (status) {
    case AUTHOR_CLAIM_STATUS.APPROVED:
      return icons.checkCircle;
    case AUTHOR_CLAIM_STATUS.DENIED:
    case AUTHOR_CLAIM_STATUS.INVALIDATED:
    case AUTHOR_CLAIM_STATUS.NULLIFIED:
    default:
      return icons.timesCircle;
  }
};

export default function AuthorClaimCaseCardStatusLabel({
  status,
}: Props): ReactElement<"div"> {
  const label = AUTHOR_CLAIM_STATUS_LABEL[status];
  const icon = getIcon(status);
  return (
    <div
      className={css(
        styles.authorClaimCaseCardStatusLabel,
        status === AUTHOR_CLAIM_STATUS.APPROVED ? styles.green : styles.red
      )}
      role="none"
    >
      <div className={css(styles.icon)}>{icon}</div>
      <div className={css(styles.label)}>{label}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimCaseCardStatusLabel: {
    alignItems: "center",
    borderRadius: 4,
    cursor: "pointer",
    display: "flex",
    height: 44,
    justifyContent: "center",
    marginLeft: 8,
    width: 144,
  },
  green: {
    color: colors.GREEN(1),
  },
  icon: {
    width: 18,
    marginRight: 8,
  },
  label: {
    width: "100%",
    maxWidth: 144,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 16,
  },
  red: {
    color: colors.RED(1),
  },
});
