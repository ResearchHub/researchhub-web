import { createUserSummary } from "~/config/utils/user";
import { css, StyleSheet } from "aphrodite";
import { TargetAuthor } from "./api/AuthorClaimCaseGetCases";
import colors from "../../config/themes/colors";
import icons from "../../config/themes/icons";
import { ReactElement, SyntheticEvent, useMemo } from "react";

type Props = {
  targetAuthor: TargetAuthor;
};

export default function AuthorClaimCaseCardTargetAuthorSection({
  targetAuthor,
  targetAuthor: { description, id, name },
}: Props): ReactElement<"div"> {
  const eduSummary = createUserSummary(targetAuthor) || "N/A";
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
      {authorEducationSummary}
      <div className={css(styles.description, styles.marginBottom)}>
        {description}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  targetAuthorSection: {
    display: "flex",
    flexDirection: "column",
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
      alignItems: "center",
      justifyContent: "center",
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
  link: {
    color: colors.BLUE(1),
    textDecoration: "none",
  },
  marginBottom: {
    marginBottom: 8,
  },
});
