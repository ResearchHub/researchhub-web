import { StyleSheet, css } from "aphrodite";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";

interface Props {
  onStart: () => void;
}

const PaperVersionIntroStep = ({ onStart }: Props) => {
  return (
    <div className={css(styles.container)}>
      <h1 className={css(styles.title)}>Submit Your Research to ResearchHub</h1>
      <p className={css(styles.description)}>
        Details TBD
      </p>
      <div className={css(styles.buttonContainer)}>
        <Button
          label="Start Submission"
          theme="solidPrimary"
          onClick={onStart}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: "24px",
    color: colors.MEDIUM_GREY(),
    maxWidth: 600,
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PaperVersionIntroStep; 