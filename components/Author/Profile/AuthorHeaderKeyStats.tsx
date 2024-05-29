import { FullAuthorProfile } from "../lib/types"
import { css, StyleSheet } from "aphrodite";

const AuthorHeaderKeyStats = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div>
      <div>Key stats</div>
      <div>Works count: {profile.summaryStats.worksCount.toLocaleString()} ({profile.openAccessPct}% Open Access)</div>
      <div>Cited by: {profile.summaryStats.citationCount.toLocaleString()}</div>
      <div>h-index: {profile.hIndex}</div>
      <div>i10-index: {profile.i10Index}</div>
    </div>
  )
}

const styles = StyleSheet.create({
})

export default AuthorHeaderKeyStats;
