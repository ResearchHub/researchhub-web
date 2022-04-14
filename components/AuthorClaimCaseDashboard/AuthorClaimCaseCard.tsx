import { AUTHOR_CLAIM_STATUS } from "./constants/AuthorClaimStatus";
import { AuthorClaimCase } from "./api/AuthorClaimCaseGetCases";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { getCardAllowedActions } from "./util/AuthorClaimCaseUtil";
import { ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { ValueOf } from "~/config/types/root_types";
import AuthorClaimCaseCardActionButton from "./AuthorClaimCaseCardActionButton";
import AuthorClaimCaseCardStatusLabel from "./AuthorClaimCaseCardStatusLabel";
import AuthorClaimCaseCardTargetAuthorSection from "./AuthorClaimCaseCardTargetAuthorSection";
import AuthorClaimCaseModal from "./AuthorClaimCaseModal";
import colors from "~/config/themes/colors";
import dayjs from "dayjs";
import icons from "~/config/themes/icons";

type Props = {
  authorClaimCase: AuthorClaimCase;
  setLastFetchTime: Function;
};

export default function AuthorClaimCaseCard({
  authorClaimCase,
  setLastFetchTime,
}: Props): ReactElement<"div"> {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [openModalType, setOpenModalType] =
    useState<ValueOf<typeof AUTHOR_CLAIM_STATUS>>("");
  const { caseData, requestor } = authorClaimCase || {};
  const { createdDate, id: caseID, status: caseStatus } = caseData || {};
  const {
    name: requestorName,
    profileImg: requestorFaceImg,
    providedEmail,
    requestorAuthorID,
  } = requestor || {};
  const formattedCreatedDate = dayjs(createdDate).format("YYYY-MM-DD");
  const actionLabels = useMemo(() => {
    return caseStatus === AUTHOR_CLAIM_STATUS.OPEN ? (
      getCardAllowedActions(caseStatus).map(
        (
          actionType: ValueOf<typeof AUTHOR_CLAIM_STATUS>,
          index: number
        ): ReactElement<typeof AuthorClaimCaseCardActionButton> => (
          <AuthorClaimCaseCardActionButton
            actionType={actionType}
            isDisabled={isSubmitting}
            index={index}
            key={`actionbutton-case-${caseID}-button-${actionType}`}
            onClick={(event: SyntheticEvent): void => {
              event.stopPropagation(); /* prevents card from collapsing */
              setOpenModalType(actionType);
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
    >
      <AuthorClaimCaseModal
        caseID={caseID}
        requestorName={requestorName}
        profileImg={requestorFaceImg}
        openModalType={openModalType}
        setOpenModalType={setOpenModalType}
        setLastFetchTime={setLastFetchTime}
      />
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
            <a
              className={css(styles.link)}
              href={`/user/${requestorAuthorID}`}
              onClick={(e: SyntheticEvent) => e.stopPropagation()}
              target="__blank"
            >
              <span className={css(styles.requestorName)}>{requestorName}</span>
            </a>
          </div>
          <div className={css(styles.row)}>
            <div className={css(styles.cardMainSection, styles.fontGrey)}>
              {providedEmail}
            </div>
          </div>
          <div className={css(styles.cardSmallerMainSection, styles.actions)}>
            {actionLabels}
          </div>
        </div>
        {!isCollapsed ? (
          <div className={css(styles.cardSubmain)}>
            <AuthorClaimCaseCardTargetAuthorSection
              caseCreatedDate={formattedCreatedDate}
              caseData={caseData}
            />
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
    maxWidth: "1200px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      maxWidth: "unset",
    },
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
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      padding: 16,
    },
  },
  cardMainSection: {
    alignItems: "center",
    display: "flex",
    height: 72,
    justifyContent: "flex-start",
    maxWidth: 500,
    overflow: "hidden",
    paddingRight: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "100%",
      height: "unset",
      paddingRight: 0,
    },
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
    width: "20%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      width: "unset",
      height: "unset",
      paddingRight: 0,
    },
  },
  actions: {
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginTop: 16,
    },
  },
  cardMainSectionWrap: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      justifyContent: "unset",
      flexDirection: "column",
      padding: "0 0 16px 0",
    },
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
  cardSubmain: {
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
    minHeight: 72,
    justifyContent: "center",
    width: "100%",
    margin: "16px 0 8px",
  },
  row: {
    display: "flex",
    flex: 1,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      flexDirection: "column",
      marginTop: 16,
    },
  },
  link: {
    color: colors.BLUE(1),
    textDecoration: "none",
  },
});
