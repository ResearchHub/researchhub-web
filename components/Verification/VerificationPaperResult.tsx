import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { PaperIcon } from "~/config/themes/icons";
import { HubBadge } from "../Hubs/HubTag";
import Link from "next/link";
import { VerificationPaperResult as VerificationPaperResultType } from "./lib/types";

interface Props {
  result: VerificationPaperResultType;
}

const VerificationPaperResult = ({ result }: Props) => {
  return (
    <div className={css(styles.paper)}>
      <div style={{ maxWidth: "100%" }}>
        <div className={css(styles.title)}>{result.title}</div>
        <div className={css(styles.metaWrapper)}>
          <div>
            <>{result.authors[0]}</>
            {result.authors.length > 1 && ` et al.`}
          </div>
          <div
            style={{
              marginLeft: 8,
              marginRight: 8,
              borderLeft: `1px solid ${colors.MEDIUM_GREY()}`,
              height: 13,
            }}
          ></div>
          <div>{result.publishedDate}</div>
          <div
            style={{
              marginLeft: 8,
              marginRight: 8,
              borderLeft: `1px solid ${colors.MEDIUM_GREY()}`,
              height: 13,
            }}
          ></div>
          <div>
            {result.doiUrl && (
              <Link
                href={result.doiUrl}
                target={"_blank"}
                style={{ color: colors.NEW_BLUE() }}
              >
                {result.doi}
              </Link>
            )}
          </div>
        </div>

        <div className={css(styles.concepts)}>
          {result.concepts.map((concept, index) => {
            return (
              <div>
                <HubBadge
                  key={`hub-${index}`}
                  size={"small"}
                  name={concept.displayName}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 500,
  },
  pagination: {
    display: "flex",
    columnGap: "5px",
    marginBottom: 15,
  },
  paginationDisabled: {
    color: colors.MEDIUM_GREY2(),
    cursor: "initial",
  },
  inputContainer: {
    marginBottom: 0,
  },
  paginationSquare: {
    cursor: "pointer",
    border: `1px solid ${colors.GREY(0.4)}`,
    height: "30px",
    width: "30px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",

    ":hover": {
      transition: "0.2s",
      backgroundColor: colors.NEW_BLUE(0.2),
      color: colors.NEW_BLUE(),
      border: `1px solid ${colors.NEW_BLUE(0.4)}`,
    },
  },
  paginationSelected: {
    backgroundColor: colors.NEW_BLUE(0.1),
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.NEW_BLUE(0.6)}`,
  },
  worksWrapper: {
    display: "none",
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
  metadata: {
    color: colors.MEDIUM_GREY2(),
    display: "flex",
    columnGap: "15px",
    marginTop: 4,
  },
  institution: {
    color: colors.MEDIUM_GREY2(),
    marginTop: 4,
    fontWeight: 500,
  },
  metadataItem: {
    display: "flex",
    columnGap: "5px",
  },
  paper: {
    display: "flex",
    columnGap: "10px",
    padding: 12,
    borderRadius: 4,
  },
  concepts: {
    display: "flex",
    columnGap: "10px",
    marginTop: 8,
    flexWrap: "wrap",
    rowGap: "5px",
  },
  metaWrapper: {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    color: colors.MEDIUM_GREY2(),
    marginTop: 4,
    width: "100%",
    flexWrap: "wrap",
    lineHeight: "20px",
  },
  terms: {
    marginTop: 15,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    rowGap: "5px",
  },
  name: {
    fontWeight: 500,
    fontSize: 18,
  },
  profile: {},
  profileSelected: {
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
  publishedWorksTitle: {
    padding: 5,
    marginLeft: -5,
    marginRight: -5,
    ":hover": {
      background: colors.GREY(0.5),
      transition: "0.2s",
    },
  },
  worksWrapperActive: {
    display: "block",
  },
  description: {
    marginTop: 5,
    color: colors.MEDIUM_GREY(),
    fontSize: 16,
    lineHeight: "22px",
  },
});

export default VerificationPaperResult;
