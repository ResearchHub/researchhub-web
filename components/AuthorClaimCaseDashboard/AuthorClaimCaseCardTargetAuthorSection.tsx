import { createUserSummary } from "~/config/utils/user";
import { css, StyleSheet } from "aphrodite";
import { TargetAuthor } from "./api/AuthorClaimCaseGetCases";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import Link from 'next/link';

type Props = {
  caseCreatedDate: string;
  targetAuthor: TargetAuthor;
  caseData: any;
};

export default function AuthorClaimCaseCardTargetAuthorSection({
  caseCreatedDate,
  targetAuthor,
  caseData,
  targetAuthor: { description, id, name },
}: Props): ReactElement<"div"> {
  const eduSummary = createUserSummary(targetAuthor) || "N/A";

  const contextHTML = useMemo(() => {
    const isPaperPageContext = caseData?.context && caseData?.context.context_content_type === 'paper';
    const isAuthorPageContext = caseData?.context && caseData?.context.context_content_type === 'author';
    if (isPaperPageContext) {
      return (
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Context - "}</span>
          <Link href={`/paper/${caseData?.context?.id}/${caseData?.context?.slug}`}>
            <a className={css(styles.link)}>
              <span className={css(styles.limitChars)}>{caseData?.context?.title}</span> (Paper)
            </a>
          </Link>
        </div>
      )
    }
    else if (isAuthorPageContext) {
      return (
        <div className={css(styles.marginBottom)}>
          <span className={css(styles.fontGrey)}>{"Context - "}</span>
          <Link href={`/user/${caseData?.context?.id}/overview`}>
            <a className={css(styles.link)}>
              <span className={css(styles.limitChars)}>{caseData?.context?.first_name} {caseData?.context?.last_name}</span> (Author)
            </a>
          </Link>
        </div>
      )
    }
    else {
      return null;
    }
  }, [caseData.id])

  const authorEducationSummary = useMemo(
    () =>
      eduSummary != null ? (
        <div
          className={
            css(styles.educationSummaryContainer, styles.marginBottom) +
            " clamp2"
          }
        >
          <div className={css(styles.educationSummary) + " clamp2"}>
            <span className={css(styles.icon)}>{icons.graduationCap}</span>
            {eduSummary}
          </div>
        </div>
      ) : null,
    [eduSummary]
  );
  return (
    <div className={css(styles.targetAuthorSection)}>
      <div className={css(styles.marginBottom)}>
        <span className={css(styles.fontGrey)}>{"Claiming Author - "}</span>
        <a
          className={css(styles.link)}
          href={`/user/${id}/`}
          onClick={(e: SyntheticEvent) => e.stopPropagation()}
          target="_blank"
        >
          <span>{name}</span>
        </a>
      </div>
      <div className={css(styles.marginBottom)}>
        <span className={css(styles.fontGrey)}>{"Case Opened - "}</span>
        <span>{caseCreatedDate}</span>
      </div>
      {contextHTML}
      {authorEducationSummary}
      <div className={css(styles.description, styles.marginBottom)}>
        {description}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  targetAuthorSection: {
    // display: "flex",
    // flexDirection: "column",
  },
  description: {
    display: "flex",
    fontFamily: "Roboto",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 400,
    width: "90%",
  },
  educationSummaryContainer: {
    color: colors.GREY(1),
    display: "flex",
    marginBottom: 10,
    "@media only screen and (max-width: 767px)": {
      // alignItems: "center",
      // justifyContent: "center",
      marginBottom: 15,
      width: "100%",
    },
  },
  educationSummary: {
    alignItems: "flex-start",
    color: "#241F3A",
    display: "flex",
    fontSize: 15,
    justifyContent: "center",
    opacity: 0.7,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
      marginTop: 10,
    },
  },
  icon: {
    alignItems: "center",
    display: "flex",
    marginRight: 5,
    width: 20,
  },
  fontGrey: {
    color: colors.GREY(1),
  },
  limitChars: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: 500,
    display: "inline-block",
    verticalAlign: "bottom",
  },
  link: {
    color: colors.BLUE(1),
    textDecoration: "none",
  },
  marginBottom: {
    marginBottom: 8,
  },
});
