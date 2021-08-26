import { StyleSheet, css } from "aphrodite";
import ResearchHubIcon from "~/static/ResearchHubIcon.js";

const ResearchHubLogo = (props) => {
  return (
    <div className={css(styles.researchHubLogo, props.className)}>
      <ResearchHubIcon />
    </div>
  );
};

const styles = StyleSheet.create({
  researchHubLogo: {
    width: 220,
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
