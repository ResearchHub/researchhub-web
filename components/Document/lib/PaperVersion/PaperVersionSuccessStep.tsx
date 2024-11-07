import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";

interface Props {
  paperId: number;
  paperTitle: string;
}

const PaperVersionSuccessStep = ({ paperId, paperTitle }: Props) => {
  return (
    <div className={css(styles.container)}>
      <img
        src="/static/icons/success2.png"
        className={css(styles.successImg)}
        alt="Success"
        draggable={false}
      />
      <div className={css(styles.title)}>Submission Successful</div>
      <div className={css(styles.message)}>
        Your manuscript has been successfully submitted to ResearchHub.
      </div>
      <div className={css(styles.buttonContainer)}>
        <Link href={`/paper/${paperId}`} style={{ textDecoration: "none" }} passHref>
          <Button
            label={`View Paper: ${paperTitle}`}
            theme="solidPrimary"
            customButtonStyle={styles.button}
          />
        </Link>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    textAlign: "center",
  },
  successImg: {
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    lineHeight: "22px",
    color: colors.BLACK(0.8),
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
  },
  button: {
    width: "100%",
    height: 50,
  },
});

export default PaperVersionSuccessStep; 