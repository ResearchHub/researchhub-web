import { FullAuthorProfile } from "../lib/types"
import { css, StyleSheet } from "aphrodite";

const AuthorHeaderKeyStats = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div className={css(styles.rootWrapper)}>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>Works count:</div> {profile.summaryStats.worksCount.toLocaleString()} <div className={css(styles.subText)}>({profile.openAccessPct}% Open Access)</div>
      </div>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>Cited by:</div> {profile.summaryStats.citationCount.toLocaleString()} works
      </div>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>h-index:</div> {profile.hIndex}
      </div>
      <div className={css(styles.lineItem)}>
        <div className={css(styles.label)}>i10-index:</div> {profile.i10Index}
      </div>      
    </div>
  )
}

const styles = StyleSheet.create({
  rootWrapper: {
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontWeight: 500,
  },
  lineItem: {
    display: "flex",
    gap: 5,
  },
  subText: {
    color: "rgb(139, 137, 148, 1)",
  }
})

export default AuthorHeaderKeyStats;
