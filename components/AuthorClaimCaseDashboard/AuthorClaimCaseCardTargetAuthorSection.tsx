import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";

import { ReactElement } from "react";
import Link from "next/link";
import { CaseData } from "./api/AuthorClaimCaseGetCases";
import { RHUser } from "~/config/types/root_types";
import { breakpoints } from "~/config/themes/screen";

type Props = {
  caseCreatedDate: string;
  caseData: CaseData;
  requestor: RHUser;
};

const getPaperUrl = (caseData: any) => {
  if (caseData?.paper) {
    return `/paper/${caseData?.paper?.id}/${caseData?.paper?.slug}`;
  } else {
    if (caseData?.targetPaperDOI?.indexOf("doi.org") > -1) {
      return caseData?.targetPaperDOI;
    }
    return "https://doi.org/" + caseData?.targetPaperDOI;
  }
};

export default function AuthorClaimCaseCardTargetAuthorSection({
  caseCreatedDate,
  caseData,
  requestor,
}: Props): ReactElement<"div"> {
  const paperUrl = getPaperUrl(caseData);
  return (
    <div className={css(styles.targetAuthorSection)}>
      <div className={css(styles.caseDetails)}>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{`Claiming Author - `}</span>
          <span>{caseData.targetAuthorName}</span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Provided Email - "}</span>
          <span>{caseData.providedEmail}</span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Case Opened - "}</span>
          <span>{caseCreatedDate}</span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Paper - "}</span>
          <Link
            href={paperUrl}
            className={css(styles.link)}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{caseData?.paper?.title || caseData?.targetPaperTitle}</span>
          </Link>
        </div>
      </div>
      <div className={css(styles.userDetails)}>
        {requestor.authorProfile.education.length > 0 && (
          <div className={css(styles.marginBottom)}>
            <span className={css(styles.fontGrey)}>{"User Education - "}</span>
            <span>{requestor.authorProfile.education[0]?.summary}</span>
          </div>
        )}
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"User Joined - "}</span>
          <span>{requestor.createdDate}</span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"User Rep - "}</span>
          <span>{requestor.reputation}</span>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  targetAuthorSection: {
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      display: "block",
    },
  },
  caseDetails: {
    width: "50%",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },
  },
  userDetails: {
    marginLeft: 35,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      marginLeft: 0,
    },
  },
  icon: {
    alignItems: "center",
    display: "flex",
    marginRight: 5,
    width: 20,
  },
  fontGrey: {
    color: colors.MEDIUM_GREY(1),
  },
  link: {
    color: colors.BLUE(1),
    textDecoration: "none",
  },
  marginBottom: {
    marginBottom: 8,
  },
});
