import { StyleSheet, css } from "aphrodite";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePlus, faBolt, faCoins, faChartLineUp } from "@fortawesome/pro-solid-svg-icons";
import RhJournalIcon from "~/components/Icons/RhJournalIcon";
import Link from "next/link";

const PaperVersionIntroStep = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.heroSection)}>
        <div className={css(styles.iconContainer)}>
          <RhJournalIcon width={60} height={60} color={colors.NEW_BLUE()} />
        </div>
        <h1 className={css(styles.title)}>Publish in the ResearchHub Journal</h1>
        <p className={css(styles.subtitle)}>
          Fast, affordable, and transparent publication process
          <span className={css(styles.priceBadge)}>Flat fee of 100 USD for a limited time</span>
        </p>
      </div>
      
      <div className={css(styles.benefitsContainer)}>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Rapid Turnaround</h3>
          <ul className={css(styles.bulletList)}>
            <li>14 days: Peer reviews done</li>
            <li>21 days: Publication decision</li>
          </ul>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faCoins} />
          </div>
          <h3 className={css(styles.benefitTitle)}>$150 to Peer Reviewers</h3>
          <span className={css(styles.benefitText)}>
            A scientist's time and expertise is valuable. We pay for peer review.
          </span>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faFilePlus} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Preprint Publication</h3>
          <span className={css(styles.benefitText)}>
            Your preprint will receive a DOI and published immediately.
          </span>
        </div>
        <div className={css(styles.benefitCard)}>
          <div className={css(styles.benefitIcon)}>
            <FontAwesomeIcon icon={faChartLineUp} />
          </div>
          <h3 className={css(styles.benefitTitle)}>Maximize Your Impact</h3>
          <span className={css(styles.benefitText)}>
            Tap into a social network that gets more eyes on your research.
          </span>
        </div>
      </div>

      <div className={css(styles.buttonContainer)}>
        <Button
          fullWidth
          label="Start Publishing"
          theme="solidPrimary"
          onClick={onStart}
          customButtonStyle={styles.button}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: `linear-gradient(180deg, ${colors.WHITE()} 0%, ${colors.NEW_BLUE(0.05)} 100%)`,
    padding: "40px 30px",
    margin: "0px auto",
    maxWidth: 1000,
    marginTop: -20,
  },
  heroSection: {
    marginBottom: 0,
    position: 'relative',
    padding: "20px 0",
    ':before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200%',
      height: '200%',
      background: `radial-gradient(circle, ${colors.NEW_BLUE(0.05)} 0%, transparent 70%)`,
      zIndex: -1,
    }
  },
  iconContainer: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center',
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%': { 
        transform: 'translateY(0px)' 
      },
      '50%': { 
        transform: 'translateY(-10px)' 
      },
      '100%': { 
        transform: 'translateY(0px)' 
      }
    }
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    background: `linear-gradient(135deg, ${colors.NEW_BLUE()} 0%, ${colors.PURPLE()} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.BLACK(0.8),
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  benefitsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 24,
    maxWidth: 1000,
    marginBottom: 40,
    width: "100%",
  },
  benefitCard: {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    borderRadius: 16,
    backgroundColor: colors.WHITE(),
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
    }
  },
  benefitIcon: {
    fontSize: 24,
    marginBottom: 15,
    color: colors.NEW_BLUE(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: 500,
    color: colors.BLACK(),
    marginBottom: 8,
    lineHeight: "28px",
    textAlign: "center",
  },
  benefitText: {
    fontSize: 14,
    color: "rgb(121, 121, 121)",
    lineHeight: "20px",
    textAlign: "center",
  },
  bulletList: {
    color: "rgb(121, 121, 121)",
    fontSize: 14,
    lineHeight: "24px",
    margin: "0 auto",
    padding: "0",
    listStylePosition: "inside",
    width: "200px",
    textAlign: "left",
    "li": {
      marginBottom: 8,
      paddingLeft: 16,
      textIndent: -16,
      ":last-child": {
        marginBottom: 0,
      },
    },
  },
  buttonContainer: {
    marginTop: 32,
    width: "100%",
    maxWidth: 600,
    // padding: "0 16px",
    boxSizing: "border-box",
  },
  button: {
    background: `linear-gradient(135deg, ${colors.NEW_BLUE()} 0%, ${colors.PURPLE()} 100%)`,
  },
  buttonGroup: {
    display: "flex",
    gap: 16,
    flexDirection: "column",
    width: "100%",
  },
  secondaryButton: {
    fontSize: 18,
    padding: "16px 32px",
    borderRadius: 30,
    fontWeight: 600,
    width: "100%",
    transition: "all 0.2s ease",
    border: `2px solid ${colors.NEW_BLUE()}`,
    color: colors.NEW_BLUE(),
    background: colors.WHITE(),
    ":hover": {
      transform: "scale(1.02)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    },
    ":active": {
      transform: "scale(0.98)",
    },
  },
  learnMoreLink: {
    color: colors.NEW_BLUE(),
    fontSize: 16,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  priceBadge: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.WHITE(),
    background: `linear-gradient(135deg, ${colors.NEW_BLUE()} 0%, ${colors.PURPLE()} 100%)`,
    padding: "2px 16px",
    borderRadius: 20,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
});

export default PaperVersionIntroStep; 