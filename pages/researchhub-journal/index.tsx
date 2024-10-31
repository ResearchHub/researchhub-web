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
        <div className={css(styles.heroBackground)} />
        <div className={css(styles.heroContent)}>
          <div className={css(styles.heroTag)}>
            Open science is the best science
          </div>
          
          <div className={css(styles.heroTextContainer)}>
            <h1 className={css(styles.heroTitle)}>
              ResearchHub is launching its first journal
            </h1>
            <p className={css(styles.heroDescription)}>
              APC's should go to scientists - that's why we pay our peer reviewers
            </p>
          </div>

          <div className={css(styles.heroButtons)}>
            <button className={css(styles.primaryButton)}>Submit Early</button>
            <button className={css(styles.secondaryButton)}>Learn more</button>
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
    width: "100%",
    overflow: "hidden",
  },
  hero: {
    position: "relative",
    width: "100%",
    height: 715,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(180deg, #587FFF 0%, #3B72FF 100%)`,
  },
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `url('/static/background/rh-journal-designs.svg') no-repeat center center`,
    backgroundSize: "contain",
    zIndex: 0,
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 1240*0.75,
    padding: "64px 32px",
    gap: 40,
  },
  heroTag: {
    background: "rgba(241, 245, 255, 0.1)",
    borderRadius: 40,
    padding: "8px 12px",
    fontSize: 14,
    lineHeight: "140%",
    textAlign: "center",
    marginTop: -325,
    color: "#FFFFFF",
  },
  heroTextContainer: {
    display: "flex", 
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    textAlign: "center",
    marginTop: -20,
  },
  heroTitle: {
    fontSize: 64,
    fontWeight: 500,
    lineHeight: "120%",
    margin: 0,
    color: "#FFFFFF",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 48,
    },
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: "140%",
    opacity: 0.8,
    maxWidth: 750,
    margin: 0,
    color: "#FFFFFF",
  },
  heroButtons: {
    display: "flex",
    gap: 20,
    marginTop: 10,
  },
  primaryButton: {
    background: "#FFFFFF",
    color: "#3971FF",
    border: "none",
    padding: "10px 18px",
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  },
  secondaryButton: {
    background: "transparent",
    color: "#FFFFFF",
    border: "1px solid #FFFFFF",
    padding: "10px 18px",
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      background: "rgba(255, 255, 255, 0.1)",
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
