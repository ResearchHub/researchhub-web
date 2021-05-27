import {
  AUTHOR_CLAIM_STATUS,
  AUTHOR_CLAIM_STATUS_LABEL,
} from "./constants/AuthorClaimStatus";
import { AuthorClaimCase } from "./api/AuthorClaimCaseGetCases";
import { css, StyleSheet } from "aphrodite";
import { getCardAllowedActions } from "./util/AuthorClaimCaseUtil";
import { ValueOf } from "../../config/types/root_types";
import { updateCaseStatus } from "./api/AuthorClaimCaseUpdateCase";
import AuthorClaimCaseCardActionButton from "./AuthorClaimCaseCardActionButton";
import AuthorClaimCaseCardStatusLabel from "./AuthorClaimCaseCardStatusLabel";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import React, { ReactElement, SyntheticEvent, useMemo, useState } from "react";

type Props = {
  authorClaimCase: AuthorClaimCase;
  cardWidth: number | string;
  setLastFetchTime: Function;
};

export default function AuthorClaimCaseCard({
  authorClaimCase,
  cardWidth,
  setLastFetchTime,
}: Props): ReactElement<"div"> {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { caseData, requestor, targetAuthor } = authorClaimCase || {};
  const { createdDate, id: caseID, status: caseStatus } = caseData || {};
  const {
    name: requestorName,
    profileImg: requestorFaceImg,
    providedEmail,
    requestorAuthorID,
  } = requestor || {};
  const { id: targetAuthorID, name: targetAuthorName } = targetAuthor || {};

  const actionLabels = useMemo(() => {
    return caseStatus === AUTHOR_CLAIM_STATUS.OPEN ? (
      getCardAllowedActions(caseStatus).map(
        (
          actionType: ValueOf<typeof AUTHOR_CLAIM_STATUS>
        ): ReactElement<typeof AuthorClaimCaseCardActionButton> => (
          <AuthorClaimCaseCardActionButton
            actionType={actionType}
            isDisabled={isSubmitting}
            key={`actionbutton-case-${caseID}-button-${actionType}`}
            onClick={(event: SyntheticEvent) => {
              event.stopPropagation(); /* prevents card collapse */
              setIsSubmitting(true);
              updateCaseStatus({
                payload: { caseID, updateStatus: actionType },
                onSuccess: () => {
                  setIsSubmitting(false);
                  setLastFetchTime(Date.now());
                },
              });
            }}
          />
        )
      )
    ) : (
      <AuthorClaimCaseCardStatusLabel status={caseStatus} />
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
              src={requestorFaceImg}
            />
            <span className={css(styles.requestorName)}>{requestorName}</span>
          </div>
          <div className={css(styles.cardMainSection, styles.fontGrey)}>
            {providedEmail}
          </div>
          <div className={css(styles.cardSmallerMainSection, styles.fontGrey)}>
            {createdDate.split("T")[0]}
          </div>
          <div className={css(styles.cardSmallerMainSection)}>
            {actionLabels}
          </div>
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
    cursor: "pointer",
    backgroundColor: "#FFF",
    border: `1px solid ${colors.GREY(0.5)}`,
    borderRadius: 4,
    display: "flex",
    fontFamily: "Roboto",
    marginBottom: 16,
    minHeight: 72,
    maxWidth: "90%",
  },
  borderBottom: {
    borderBottom: `1px solid ${colors.GREY(0.5)}`,
  },
  cardMain: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: "0px 16px",
    width: "100%",
  },
  cardMainSection: {
    alignItems: "center",
    display: "flex",
    height: 72,
    justifyContent: "flex-start",
    overflow: "hidden",
    paddingRight: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "24%",
  },
  cardSmallerMainSection: {
    alignItems: "center",
    display: "flex",
    height: 72,
    justifyContent: "flex-start",
    overflow: "hidden",
    paddingRight: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "15%",
  },
  cardMainSectionWrap: {
    display: "flex",
    justifyContent: "space-between",
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
