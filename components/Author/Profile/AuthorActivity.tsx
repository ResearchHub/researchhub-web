import Histogram from "~/components/shared/Histogram";
import { css, StyleSheet } from "aphrodite";

const AuthorActivity = ({
  activity
}: {
  activity: Array<{
    year: number;
    worksCount: number;
    citationCount: number;
  }>
}) => {
  const publicationHistogram = activity
    .map((activity) => ({
      key: String(activity.year),
      value: activity.worksCount,
    }))
    .sort((a, b) => parseInt(a.key) - parseInt(b.key));

  const citationHistogram = activity
    .map((activity) => ({
      key: String(activity.year),
      value: activity.citationCount,
    }))
    .sort((a, b) => parseInt(a.key) - parseInt(b.key));

  return (
    <div className={css(styles.histogramWrapper)}>
      <div style={{ width: "100%", height: 150 }}>
        <div>Activity</div>
        <Histogram data={publicationHistogram} />
      </div>
      {/* <div style={{ width: "50%", height: 150 }}>
        <div>Activity</div>
        <Histogram data={citationHistogram} />
      </div> */}
    </div>
  )
}

const styles = StyleSheet.create({
  histogramWrapper: {
    display: "flex",
  }  
})

export default AuthorActivity;