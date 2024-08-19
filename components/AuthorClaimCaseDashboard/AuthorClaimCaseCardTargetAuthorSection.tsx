import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";

import { ReactElement } from "react";
import Link from "next/link";
import { CaseData } from "./api/AuthorClaimCaseGetCases";
import { RHUser } from "~/config/types/root_types";
import { breakpoints } from "~/config/themes/screen";
import { formatDateStandard } from "~/config/utils/dates";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import VerifiedBadge from "../Verification/VerifiedBadge";

type Props = {
  caseCreatedDate: string;
  caseData: CaseData;
  requestor: RHUser;
};

const getPaperUrl = (caseData: any) => {
  if (caseData?.paper) {
    return `/paper/${caseData?.paper?.id}/${caseData?.paper?.slug}`;
  } else {
    if (caseData?.targetPaperDOI.indexOf("doi.org") > -1) {
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
  console.log("caseData", caseData);
  const paperUrl = getPaperUrl(caseData);
  return (
    <div className={css(styles.targetAuthorSection)}>
      <div className={css(styles.caseDetails)}>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Case Opened - "}</span>
          <span>{formatDateStandard(caseCreatedDate, "MMM D, YYYY")}</span>
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
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"User Joined - "}</span>
          <span>
            {formatDateStandard(requestor.createdDate, "MMM D, YYYY")}
          </span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Verfied name - "}</span>
          <span>
            {caseData?.userVerification?.verifiedName || "Not verified"}
            {caseData?.userVerification?.isVerified && <VerifiedBadge height={15} width={15}  />}
          </span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Email - "}</span>
          <span>
            {caseData?.userEmail || "N/A"}
          </span>
        </div>                
      </div>
      <div className={css(styles.userDetails)}>
        <div
          className={css(styles.marginBottom)}
          style={{ display: "flex", gap: 10 }}
        >
          <span className={css(styles.fontGrey)}>{"Reward Amount - "}</span>
          <span className={css(styles.rsc)}>
            <ResearchCoinIcon version={4} height={20} width={20} />
            {caseData?.paperReward?.rewardAmount?.toLocaleString()} RSC
          </span>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Primary hub - "}</span>
          <span>
            {caseData?.paper?.primary_hub}
          </span>
        </div>          
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Preregistration - "}</span>
          <Link
            href={caseData?.preregistrationUrl || ""}
            className={css(styles.link)}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{caseData?.preregistrationUrl}</span>
          </Link>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Open data - "}</span>
          <Link
            href={caseData?.openDataUrl || ""}
            className={css(styles.link)}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{caseData?.openDataUrl}</span>
          </Link>
        </div>
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Citation change - "}</span>
          <span className={css(styles.citations)}>
            + {caseData?.paperReward?.citationChange}
          </span>
        </div>      
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  rsc: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    color: colors.ORANGE_DARK(),
  },
  citations: {
    color: colors.GREEN(1),
  },
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
