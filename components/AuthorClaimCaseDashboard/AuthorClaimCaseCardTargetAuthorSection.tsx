import { createUserSummary } from "~/config/utils/user";
import { css, StyleSheet } from "aphrodite";
import { TargetAuthor } from "./api/AuthorClaimCaseGetCases";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import Link from 'next/link';

type Props = {
  caseCreatedDate: string;
  caseData: any;
};

export default function AuthorClaimCaseCardTargetAuthorSection({
  caseCreatedDate,
  caseData,
}: Props): ReactElement<"div"> {
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
        <Link href={`/paper/${caseData?.paper?.id}/${caseData?.paper?.slug}`}>
          <a className={css(styles.link)}>
            <span>{caseData?.paper?.title}</span>
          </a>
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
