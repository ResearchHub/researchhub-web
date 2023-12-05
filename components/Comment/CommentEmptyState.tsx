import colors from "./lib/colors";
import { css, StyleSheet } from "aphrodite";
import { NullableString, RhDocumentType } from "~/config/types/root_types";

type Args = {
  forSection: NullableString;
  documentType: RhDocumentType;
  height: string;
};

const CommentEmptyState = ({ forSection, documentType, height }: Args) => {
  return (
    <div className={css(styles.wrapper)} style={{ height }}>
      {forSection === "REVIEW" ? (
        <div>{`This ${documentType} has not been reviewed yet.`}</div>
      ) : forSection === "BOUNTY" ? (
        <div>{`This ${documentType} has no bounties.`}</div>
      ) : forSection === "REPLICABILITY_COMMENT" ? (
        <div>{`This ${documentType} has no comments on replicability yet.`}</div>
      ) : (
        <div>
          <div className={css(styles.bigText)}>Start the discussion.</div>
          {`This ${documentType} has not yet been discussed.`}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    color: colors.secondary.text,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    lineHeight: "34px",
    fontSize: 18,
  },
  bigText: {
    fontSize: 24,
    fontWeight: 500,
  },
  smallText: {},
});

export default CommentEmptyState;
