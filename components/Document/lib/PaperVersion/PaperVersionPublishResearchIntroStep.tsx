import { StyleSheet, css } from "aphrodite";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBookOpen, 
  faUsers, 
  faComments, 
  faChartNetwork,
  faFileArrowUp 
} from "@fortawesome/pro-solid-svg-icons";

const PaperVersionPublishResearchIntroStep = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.iconContainer)}>
        <FontAwesomeIcon icon={faFileArrowUp} className={css(styles.icon)} />
      </div>
      <h1 className={css(styles.title)}>Share Your Research with the World</h1>
      <p className={css(styles.subtitle)}>
        Join the open science movement and make your research accessible to everyone
      </p>
      <div className={css(styles.benefitsContainer)}>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Open Access</h3>
          <span className={css(styles.benefitText)}>
            Make your research freely available to readers worldwide
          </span>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Build Your Network</h3>
          <span className={css(styles.benefitText)}>
            Connect with researchers in your field and grow your academic network
          </span>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faComments} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Get Feedback</h3>
          <span className={css(styles.benefitText)}>
            Receive valuable feedback from the scientific community
          </span>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faChartNetwork} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Increase Impact</h3>
          <span className={css(styles.benefitText)}>
            Track engagement and measure the impact of your research
          </span>
        </div>
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button
          fullWidth
          label="Start Publishing"
          theme="solidPrimary"
          onClick={onStart}
          customStyles={styles.button}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 30px",
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    color: colors.NEW_BLUE(1.0),
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: colors.BLACK(),
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.MEDIUM_GREY(),
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 24,
    maxWidth: 600,
    marginBottom: 32,
    width: "100%",
    padding: "0 16px",
  },
  benefitCard: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 24px",
    borderRadius: 12,
    backgroundColor: colors.WHITE(),
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  benefitIcon: {
    fontSize: 32,
    marginBottom: 20,
    color: colors.NEW_BLUE(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 12,
    lineHeight: "28px",
    textAlign: "center",
  },
  benefitText: {
    fontSize: 14,
    color: colors.MEDIUM_GREY(),
    lineHeight: "20px",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 32,
    width: "100%",
    maxWidth: 600,
    padding: "0 16px",
  },
  button: {
    fontSize: 18,
    padding: "16px 32px",
    borderRadius: 30,
    fontWeight: 600,
    width: "100%",
    transition: "all 0.2s ease",
    background: `linear-gradient(135deg, ${colors.NEW_BLUE()} 0%, ${colors.PURPLE()} 100%)`,
    ":hover": {
      transform: "scale(1.02)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    },
    ":active": {
      transform: "scale(0.98)",
    },
  },
});

export default PaperVersionPublishResearchIntroStep; 