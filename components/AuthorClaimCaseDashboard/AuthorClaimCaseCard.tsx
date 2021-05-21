import {
  AUTHOR_CLAIM_STATUS,
  AUTHOR_CLAIM_STATUS_LABEL,
} from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { getCardAllowedActions } from "./util/AuthorClaimCaseUtil";
import { ID, ValueOf } from "../../config/types/root_types";
import { silentEmptyFnc } from "../../config/utils/nullchecks";
import AuthorClaimCaseCardActionButton from "./AuthorClaimCaseCardActionButton";
import AuthorClaimCaseCardStatusLabel from "./AuthorClaimCaseCardStatusLabel";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import React, { ReactElement, SyntheticEvent, useMemo, useState } from "react";

export type AuthorClaimCase = {
  caseID: ID;
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS> | string;
  requestorID: ID;
  requestorEmail: string;
  requestorName: string;
  targetAuthorID: ID;
  targetAuthorName: string;
};

type Props = {
  authorClaimCase: AuthorClaimCase;
  cardWidth: number | string;
};

export default function AuthorClaimCaseCard({
  authorClaimCase: {
    caseID,
    caseStatus,
    requestorEmail,
    requestorName,
    targetAuthorName,
  },
  cardWidth,
}: Props): ReactElement<"div"> {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const actionLabels = useMemo(() => {
    return caseStatus === AUTHOR_CLAIM_STATUS.OPEN ? (
      getCardAllowedActions(caseStatus).map(
        (
          actionType: ValueOf<typeof AUTHOR_CLAIM_STATUS>
        ): ReactElement<typeof AuthorClaimCaseCardActionButton> => (
          <AuthorClaimCaseCardActionButton
            actionType={actionType}
            key={`actionbutton-case-${caseID}-button-${actionType}`}
            onClick={(event: SyntheticEvent) => {
              event.stopPropagation(); /* prevents card collapse */
              silentEmptyFnc();
            }}
          />
        )
      )
    ) : (
      <AuthorClaimCaseCardStatusLabel
        label={AUTHOR_CLAIM_STATUS_LABEL[caseStatus]}
      />
    );
  }, [caseStatus]);

  return (
    <div
      className={css(styles.authorClaimCaseCard)}
      onClick={(): void => setIsCollapsed(!isCollapsed)}
      role="none"
      style={{ width: cardWidth }}
    >
      <div className={css(styles.chevronWrap)}>
        {isCollapsed ? icons.chevronDown : icons.chevronUp}
      </div>
      <div className={css(styles.cardMain)}>
        <div
          className={css(
            styles.cardMainSectionWrap,
            !isCollapsed && styles.borderBottom
          )}
        >
          <div className={css(styles.cardMainSection)}>
            <img
              className={css(styles.requestorFaceImg)}
              src={
                "https://lh3.googleusercontent.com/a-/AOh14GieST7Py5kmh3_9cFfAZJb1UHKAJR7uRCZ9ORGT=s96-c"
              }
            />
            <span className={css(styles.requestorName)}>{requestorName}</span>
          </div>
          <div className={css(styles.cardMainSection, styles.fontGrey)}>
            {requestorEmail}
          </div>
          <div className={css(styles.cardMainSection, styles.fontGrey)}>
            {Date.now()}
          </div>
          <div className={css(styles.cardMainSection)}>{actionLabels}</div>
        </div>
        {!isCollapsed ? (
          <div className={css(styles.cardSubmain)}>
            <div className={css(styles.requestorSubInfo, styles.fontGrey)}>
              Claiming Author
            </div>
            <div> {targetAuthorName} </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimCaseCard: {
    display: "flex",
    backgroundColor: "#FFF",
    border: `1px solid ${colors.GREY(0.5)}`,
    borderRadius: 4,
    fontFamily: "Roboto",
    marginBottom: 16,
    minHeight: 72,
  },
  borderBottom: {
    borderBottom: `1px solid ${colors.GREY(0.5)}`,
  },
  cardMain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px 16px",
    width: "100%",
  },
  cardMainSection: {
    alignItems: "center",
    display: "flex",
    height: 72,
    justifyContent: "flex-start",
    paddingRight: 16,
    width: "24%",
  },
  cardMainSectionWrap: {
    display: "flex",
    width: "100%",
  },
  cardSubmain: {
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
    height: 72,
    justifyContent: "center",
    width: "100%",
  },
  chevronWrap: {
    alignItems: "center",
    color: "#787c7e",
    display: "flex",
    height: 72,
    justifyContent: "center",
    marginLeft: 12,
    width: 36,
  },
  fontGrey: {
    color: colors.GREY(1),
  },
  requestorFaceImg: {
    borderRadius: "50%",
    height: 40,
    marginRight: 12,
    width: 40,
  },
  requestorName: {
    fontSize: 18,
    fontWeight: 400,
  },
  requestorSubInfo: {
    marginBottom: 8,
  },
});
