import { AUTHOR_CLAIM_STATUS_LABEL } from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { ValueOf } from "../../config/types/root_types";
import React, { ReactElement, SyntheticEvent } from "react";

type Props = {
  label: ValueOf<typeof AUTHOR_CLAIM_STATUS_LABEL>;
};

export default function AuthorClaimCaseCardStatusLabel({
  label,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.authorClaimCaseCardStatusLabel)} role="none">
      {label}
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
});
