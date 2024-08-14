import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { AuthorSummaryStats, FullAuthorProfile } from "../lib/types";
import { css, StyleSheet } from "aphrodite";

const AuthorHeaderKeyStats = ({ summaryStats, profile }: { summaryStats: AuthorSummaryStats, profile: FullAuthorProfile }) => {
  return (
    <div className={css(styles.rootWrapper)}>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>Upvotes received:</div>{" "}
        <div className={css(styles.value)}>
          {summaryStats.upvotesReceived}
        </div>
      </div>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>Publications:</div>{" "}
        <div className={css(styles.value)}>
          {summaryStats.worksCount.toLocaleString()}{" "}
          {summaryStats.worksCount > 0 && (
            <div className={css(styles.subText)}>
              ({summaryStats.openAccessPct}% Open Access)
            </div>
          )}
        </div>
      </div>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>Cited by:</div>{" "}
        <div className={css(styles.value)}>
          {summaryStats.citationCount.toLocaleString()}
        </div>
      </div>
      <div style={{ display: "flex", columnGap: "5px" }}>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.label)}>h-index:</div>{" "}
          <div className={css(styles.value)}>{profile.hIndex}</div>
        </div>
        <div style={{ fontSize: 18 }}>/</div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.label)}>i10-index:</div>{" "}
          <div className={css(styles.value)}>{profile.i10Index}</div>
        </div>
      </div>
      {summaryStats.amountFunded > 0 && (
        <div className={css(styles.lineItem)}>
          <div className={css(styles.label)}>Amount funded:</div>{" "}
          <div className={css(styles.value)}>
            <ResearchCoinIcon version={4} width={15} height={15} />
            {summaryStats.amountFunded.toLocaleString()}
          </div>
        </div>      
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: 10,
  },
  label: {
    fontWeight: 500,
  },
  lineItem: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  subText: {
    color: "rgb(139, 137, 148, 1)",
  },
  value: {
    fontWeight: 400,
    fontSize: 14,
    display: "flex",
    gap: 5,
  },
});

export default AuthorHeaderKeyStats;
