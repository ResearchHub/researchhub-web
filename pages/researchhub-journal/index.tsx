import { css, StyleSheet } from "aphrodite";
import { PublicationTypes } from "~/components/ResearchHub/PublicationTypes";
import { HowItWorks } from "~/components/ResearchHub/HowItWorks";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUsers, faFileCheck, faFilePlus, faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import JournalInfoSection from "~/components/ResearchHub/JournalInfoSection";

function ResearchHubJournalPage(): JSX.Element {
  const handleEarlySubmit = () => {
    // TODO: Implement toast notification
    console.log("Early submission recorded");
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      const offset = howItWorksSection.offsetTop - 88; // Subtract header height
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={css(styles.container)}>
      {/* Hero Section */}
      <div className={css(styles.hero)}>
        <div className={css(styles.heroContent)}>
          <p className={css(styles.heroSubtitle)}>Open science = better science</p>
          <h1 className={css(styles.heroTitle)}>
            ResearchHub
          </h1>
          <p className={css(styles.heroDescription)}>
            APC's should go to scientists - that's why we pay our peer reviewers
          </p>
          <div className={css(styles.heroButtons)}>
            <button 
              className={css(styles.primaryButton)}
              onClick={handleEarlySubmit}
            >
              Submit Early
            </button>
            <button 
              className={css(styles.secondaryButton)}
              onClick={scrollToHowItWorks}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features - Clean white section */}
      <div className={css(styles.whiteSection)}>
        <div className={css(styles.featuresGrid)}>
          <div className={css(styles.featureCard)}>
            <FontAwesomeIcon icon={faClock} className={css(styles.featureIcon)} />
            <h3 className={css(styles.featureTitle)}>9-Day Decision</h3>
            <p className={css(styles.featureDescription)}>
              Rapid turnaround with guaranteed decision timeline
            </p>
          </div>

          <div className={css(styles.featureCard)}>
            <FontAwesomeIcon icon={faUsers} className={css(styles.featureIcon)} />
            <h3 className={css(styles.featureTitle)}>Paid Peer Review</h3>
            <p className={css(styles.featureDescription)}>
              $150 per review, ensuring high-quality feedback
            </p>
          </div>

          <div className={css(styles.featureCard)}>
            <FontAwesomeIcon icon={faFileCheck} className={css(styles.featureIcon)} />
            <h3 className={css(styles.featureTitle)}>Constructive Process</h3>
            <p className={css(styles.featureDescription)}>
              No rejections - only collaborative improvement
            </p>
          </div>

          <div className={css(styles.featureCard)}>
            <FontAwesomeIcon icon={faFilePlus} className={css(styles.featureIcon)} />
            <h3 className={css(styles.featureTitle)}>Free Preprints</h3>
            <p className={css(styles.featureDescription)}>
              Immediate preprint publishing included
            </p>
          </div>
        </div>
      </div>

      {/* Publication Types - Subtle blue gradient */}
      <div className={css(styles.subtleGradientSection)}>
        <PublicationTypes />
      </div>

      {/* Journal Info - Clean white for contrast */}
      <div className={css(styles.whiteSection)}>
        <JournalInfoSection />
      </div>

      {/* How it Works - Add id for scroll target */}
      <div id="how-it-works" className={css(styles.subtleGradientSection)}>
        <HowItWorks />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
  },
  hero: {
    background: `url('/static/background/journal-background.png') no-repeat center center`,
    backgroundSize: 'cover',
    color: "#fff",
    position: "relative",
    borderBottom: `1px solid ${colors.GREY_LINE()}`,
  },
  heroContent: {
    maxWidth: 1520,
    margin: "0 auto",
    padding: "64px 32px 48px", // Reduced padding for top and bottom
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "64px 16px 48px", // Reduced padding for small screens
    },
  },
  heroSubtitle: {
    fontSize: 24,
    marginBottom: 24,
    opacity: 0.9,
  },
  heroTitle: {
    fontSize: 72,
    fontWeight: 700,
    marginBottom: 24,
    lineHeight: 1.2,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 48,
    },
  },
  heroDescription: {
    fontSize: 30,
    marginBottom: 48,
    opacity: 0.9,
    lineHeight: 1.5,
    maxWidth: 800,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 24,
    },
  },
  heroButtons: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#fff",
    color: colors.NEW_BLUE(),
    border: "2px solid #fff",
    padding: "16px 32px",
    fontSize: 20,
    borderRadius: 12,
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: colors.WHITE(0.8),
    },
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    padding: "16px 32px",
    fontSize: 20,
    borderRadius: 12,
    cursor: "pointer",
    transition: "background-color 0.2s",
    backdropFilter: "blur(4px)",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
    },
  },
  featuresGrid: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 32,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gridTemplateColumns: "1fr",
    },
  },
  featureCard: {
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    transition: "all 0.2s ease-in-out",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      borderColor: colors.NEW_BLUE(0.1),
    },
  },
  featureIcon: {
    fontSize: 32,
    color: colors.NEW_BLUE(0.9),
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 12,
    color: colors.BLACK(0.9),
    letterSpacing: "-0.01em",
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 1.6,
    color: colors.BLACK(0.6),
  },
  mainContent: {
    flex: "1 1 auto",
    minWidth: 0,
  },
  journalInfoSection: {
    padding: "64px 0",
  },
  infoContainer: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
  },
  section: {
    background: "#fff",
    borderRadius: 12,
    padding: 32,
    marginBottom: 32,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    transition: "border-color 0.2s ease",
    ":hover": {
      borderColor: colors.NEW_BLUE(0.2),
    },
  },
  description: {
    fontSize: 14,
    lineHeight: "22px",
    color: colors.BLACK(0.6),
    marginBottom: 15,
  },
  subtleGradientSection: {
    background: `linear-gradient(to bottom, ${colors.BLUE(0.02)}, ${colors.BLUE(0.06)})`,
    padding: "40px 0",
    position: "relative",
    borderTop: `1px solid ${colors.GREY_LINE(0.5)}`,
    borderBottom: `1px solid ${colors.GREY_LINE(0.5)}`,
  },
  whiteSection: {
    background: "#fff",
    padding: "40px 0", // Increased padding for better spacing
    position: "relative",
    zIndex: 1,
  },
});

export default ResearchHubJournalPage as React.FC;
