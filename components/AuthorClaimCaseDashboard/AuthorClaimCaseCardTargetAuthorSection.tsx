import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";

import { ReactElement } from "react";
import Link from "next/link";

type Props = {
  caseCreatedDate: string;
  caseData: any;
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
}: Props): ReactElement<"div"> {
  const paperUrl = getPaperUrl(caseData);

  return (
    <div className={css(styles.targetAuthorSection)}>
      <div className={css(styles.marginBottom)}>
        <span className={css(styles.fontGrey)}>{`Claiming Author - `}</span>
        <span>{caseData.targetAuthorName}</span>
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
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: "center",
    display: "flex",
    marginRight: 5,
    width: 20,
  },
  fontGrey: {
    color: colors.GREY(1),
  },
  link: {
    color: colors.BLUE(1),
    textDecoration: "none",
  },
  marginBottom: {
    marginBottom: 8,
  },
});
