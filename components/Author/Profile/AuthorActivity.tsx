import Histogram from "~/components/shared/Histogram";
import { css, StyleSheet } from "aphrodite";
import Toggle from "~/components/Form/Toggle";
import { useState } from "react";
import colors from "~/config/themes/colors";

const AuthorActivity = ({
  activity
}: {
  activity: Array<{
    year: number;
    worksCount: number;
    citationCount: number;
  }>
}) => {

  const [selected, setSelected] = useState("publications");

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
      <div className={css(styles.toggleWrapper)}>
        <Toggle options={[{label: "Publications", value: "publications"}, {label: "Citations", value: "citations"}]} onSelect={(selected) => setSelected(selected.value)} selected={selected} />
      </div>
      {selected === "publications" && (
        <div style={{ width: "100%", height: 150 }}>
          <Histogram data={publicationHistogram} />
        </div>
      )}
      {selected === "citations" && (
        <div style={{ width: "100%", height: 150 }}>
          <Histogram data={citationHistogram} histogramBarStyle={styles.citationBarStyle} />
        </div>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  histogramWrapper: {
  },
  toggleWrapper: {
    display: "inline-flex",  
    marginBottom: 20,
  },
  citationBarStyle: {
    backgroundColor: colors.GREEN2(),
  }
})

export default AuthorActivity;