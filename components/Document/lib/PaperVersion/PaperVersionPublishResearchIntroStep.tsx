import { StyleSheet, css } from "aphrodite";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBookOpen, 
  faComments, 
  faChartLineUp,
} from "@fortawesome/pro-solid-svg-icons";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";

const PaperVersionPublishResearchIntroStep = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.heroSection)}>
        <h1 className={css(styles.title)}>Publish on ResearchHub</h1>
        <p className={css(styles.subtitle)}>
          Join the open science movement and make your research accessible to everyone
        </p>
      </div>
      
      <div className={css(styles.benefitsContainer)}>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Open Access</h3>
          <span className={css(styles.benefitText)}>
          Open access immediately, with a permanent DOI.
          </span>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faChartLineUp} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Maximize your Impact</h3>
          <span className={css(styles.benefitText)}>
          Tap into a social network that gets more eyes on your research.
          </span>
        </div>        
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <ResearchCoinIcon width={32} height={32} version={4} color={colors.NEW_BLUE()} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Earn RSC Rewards</h3>
          <span className={css(styles.benefitText)}>
            Earn ResearchCoin whenever your paper gets cited.
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
      </div>
      
      <div className={css(styles.buttonContainer)}>
        <Button
          fullWidth
          label="Start"
          theme="solidPrimary"
          onClick={onStart}
          buttonStyle={styles.button}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: `linear-gradient(180deg, ${colors.WHITE()} 0%, ${colors.ORANGE(0.05)} 100%)`,
    padding: "40px 30px",
    margin: "0px auto",
    maxWidth: 1000,
    marginTop: -20,
  },
  heroSection: {
    marginBottom: 0,
    position: 'relative',
    padding: "20px 0",
  },
  iconContainer: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center',
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
      '100%': { transform: 'translateY(0px)' }
    }
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.MEDIUM_GREY(),
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  benefitsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 24,
    maxWidth: 600,
    marginBottom: 32,
    width: "100%",
    // padding: "0 16px",
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
    // padding: "0 16px",
    boxSizing: "border-box",
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