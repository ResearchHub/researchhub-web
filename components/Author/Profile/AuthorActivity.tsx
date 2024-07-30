import Histogram from "~/components/shared/Histogram";
import { css, StyleSheet } from "aphrodite";
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

  const [selected, setSelected] = useState<"publications"|"citations">("publications");

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
      <div className={css(styles.sectionHeader)}>Publications & Citations</div>
      {selected === "publications" && (
        <div style={{ width: "100%", height: 150 }}>
          <Histogram type={selected} data={publicationHistogram} />
        </div>
      )}
      {selected === "citations" && (
        <div style={{ width: "100%", height: 150 }}>
          <Histogram type={selected} data={citationHistogram} histogramBarStyle={styles.citationBarStyle} />
        </div>
      )}
      <div className={css(styles.toggleWrapper)}>
        <div className={css(styles.toggleOption, selected === "publications" && styles.toggleOptionPublicationsSelected)} onClick={() => setSelected("publications")}>Publications</div>
        <div className={css(styles.toggleOption, selected === "citations" && styles.toggleOptionCitationSelected)} onClick={() => setSelected("citations")}>Citations</div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  toggleOption: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
    fontWeight: 400,
    marginRight: 10,
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    }
  },
  toggleOptionCitationSelected: {
    color: colors.NEW_GREEN(),
    fontWeight: 500,
  },
  toggleOptionPublicationsSelected: {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
  },  
  toggleWrapper: {
    display: "inline-flex",  
    gap: 10,
  },
  histogramWrapper: {
  },
  citationBarStyle: {
    backgroundColor: colors.GREEN2(),
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },     
})

export default AuthorActivity;