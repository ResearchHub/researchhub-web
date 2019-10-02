import Link from "next/link";
import { StyleSheet, css } from "aphrodite";

const ResearchHubLogo = (props) => {
  return (
    <div className={css(styles.researchHubLogo)}>
      <img
        className={css(styles.icon)}
        src={"/static/ResearchHubIcon.png"}
        height={20}
      />
      <span className={css(styles.text, styles.bold)}>Research</span>
      <span className={css(styles.text)}>Hub</span>
    </div>
  );
};

const styles = StyleSheet.create({
  researchHubLogo: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
  },
});

export default ResearchHubLogo;
