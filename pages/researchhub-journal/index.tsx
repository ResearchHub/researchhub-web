import { css, StyleSheet } from "aphrodite";
import { HowItWorks } from "~/components/ResearchHubJournal/HowItWorks";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCoins, faFilePlus, faBolt, faChartLineUp } from "@fortawesome/pro-solid-svg-icons";
import EditorialBoardSection from "~/components/ResearchHubJournal/EditorialBoard";
import RhJournalIcon from "~/components/Icons/RhJournalIcon";
import ScrollingHubTags from "~/components/ResearchHubJournal/ScrollingHubTags";
import { useState } from "react";
import { useRouter } from 'next/router';
import JournalLayout from "~/components/ResearchHubJournal/JournalLayout";

function ResearchHubJournalPage(): JSX.Element {
  const router = useRouter();

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

  const FeatureItem = ({ text }) => (
    <div className={css(styles.feature)}>
      <FontAwesomeIcon 
        icon={faBolt} 
        className={css(styles.checkIcon)}
      />
      <span className={css(styles.featureText)}>{text}</span>
    </div>
  );

  return (
    <JournalLayout>
      <div className={css(styles.container)}>
        {/* Hero Section */}
        <div className={css(styles.hero)}>
          <div className={css(styles.heroContent)}>
            <div className={css(styles.heroTagWrapper)}>
              <div className={css(styles.heroTag)}>Coming Soon</div>
            </div>
            
            <div className={css(styles.titleContainer)}>
              <RhJournalIcon width={65} height={65} color={colors.WHITE()} />
              <h1 className={css(styles.heroTitle)}>ResearchHub Journal</h1>
            </div>
            
            <p className={css(styles.heroDescription)}>
              APC's should go to scientists - <span className={css(styles.underlineOnHover)}>that's why we pay our peer reviewers</span>
            </p>

            <div className={css(styles.heroButtons)}>
              <button 
                onClick={() => window.open('https://forms.gle/3x1F6Gj4pxoDUHU19', '_blank')}
                className={css(styles.primaryButton)}
              >
                Submit Early
              </button>
              <button 
                onClick={scrollToHowItWorks}
                className={css(styles.secondaryButton)}
              >
                Learn More
              </button>
            </div>

            <ScrollingHubTags />

            <div className={css(styles.featureList)}>
              <FeatureItem text="21 days from submission to peer review completion" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={css(styles.featuresSection)}>
          <h2 className={css(styles.featuresTitle)}>About this journal</h2>
          <p className={css(styles.featuresDescription)}>
            The ResearchHub Journal aims to accelerate the pace of science through novel 
            incentive structures that reward authors for reproducible research and compensate 
            peer reviewers for their expertise. Authors receive rapid, constructive feedback 
            through 2+ expert open peer reviews.
          </p>
          
          <div className={css(styles.featuresGrid)}>
            <div className={css(styles.featureCard)}>
              <FontAwesomeIcon icon={faFilePlus} className={css(styles.featureIcon)} />
              <div className={css(styles.featureContent)}>
                <h3 className={css(styles.featureTitle)}>Preprint Publication</h3>
                <p className={css(styles.featureDescription)}>
                  Immediate early sharing of research, at no cost.
                </p>
              </div>
            </div>

            <div className={css(styles.featureCard)}>
              <FontAwesomeIcon icon={faBolt} className={css(styles.featureIcon)} />
              <div className={css(styles.featureContent)}>
                <h3 className={css(styles.featureTitle)}>Rapid Turnaround</h3>
                <ul className={css(styles.bulletList)}>
                  <li>14 days: Peer reviews done</li>
                  <li>21 days: Publication decision</li>
                </ul>
              </div>
            </div>

            <div className={css(styles.featureCard)}>
              <FontAwesomeIcon 
                icon={faCoins} 
                className={css(styles.featureIcon)}
              />
              <div className={css(styles.featureContent)}>
                <h3 className={css(styles.featureTitle)}>$150 to Peer Reviewers</h3>
                <p className={css(styles.featureDescription)}>
                  A scientist's time and expertise is valuable. We pay for peer review.
                </p>
              </div>
            </div>

            <div className={css(styles.featureCard)}>
              <FontAwesomeIcon icon={faChartLineUp} className={css(styles.featureIcon)} />
              <div className={css(styles.featureContent)}>
                <h3 className={css(styles.featureTitle)}>Maximize Your Impact</h3>
                <p className={css(styles.featureDescription)}>
                  Tap into a social network that gets more eyes on your research.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Info Section */}
        <EditorialBoardSection />

        {/* How it Works Section */}
        <div id="how-it-works" className={css(styles.subtleGradientSection)}>
          <HowItWorks />
        </div>
      </div>
    </JournalLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  hero: {
    position: 'relative',
    width: '100%',
    minHeight: 400,
    height: 'auto',
    paddingBottom: 60,
    background: `
      radial-gradient(circle at 50% 50%, ${colors.LIGHT_BLUE(0.1)} 0%, ${colors.NEW_BLUE()} 100%),
      linear-gradient(180deg, ${colors.NEW_BLUE()} 0%, ${colors.NEW_BLUE(0.8)} 100%)
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingBottom: 40,
    },
  },
  heroContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
    marginTop: 40,
    width: '100%',
    maxWidth: 900,
    padding: '0 16px',
    boxSizing: 'border-box',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gap: 24,
      marginTop: 32,
    },
  },
  heroTagWrapper: {
    position: 'relative',
    top: -0,
    right: 0,
    zIndex: 2,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      position: 'relative',
      top: 0,
      right: 'auto',
      marginLeft:0,
      marginBottom: -0,
    },
  },
  heroTag: {
    padding: '8px 12px',
    background: colors.WHITE(0.1),
    borderRadius: 40,
    color: colors.WHITE(),
    fontSize: 14,
    lineHeight: '140%',
    fontWeight: 400,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    whiteSpace: 'nowrap',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: 'column',
      gap: 16,
    },
  },
  heroTitle: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 64,
    lineHeight: '120%',
    color: colors.WHITE(),
    margin: 0,
    textAlign: 'center',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 36,
      lineHeight: '110%',
      padding: '0 16px',
    },
  },
  heroDescription: {
    fontSize: 18,
    lineHeight: '22px',
    textAlign: 'center',
    color: colors.WHITE(0.8),
    margin: '0 0 20px 0',
    maxWidth: '100%',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
      lineHeight: '140%',
      padding: '0 16px',
      maxWidth: '100%',
    },
  },
  underlineOnHover: {
    cursor: 'pointer',
    position: 'relative',
    transition: 'color 0.15s ease',
    ':after': {
      content: '""',
      position: 'absolute',
      width: '0%',
      height: '1px',
      bottom: '-2px',
      left: '0',
      backgroundColor: colors.WHITE(),
      transition: 'width 0.15s ease',
    },
    ':hover': {
      color: colors.WHITE(),
      ':after': {
        width: '100%',
      }
    }
  },
  heroButtons: {
    display: 'flex',
    gap: 20,
    marginTop: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: 'column',
      width: '100%',
      minWidth: 200,
      maxWidth: 280,
      gap: 12,
    },
  },
  primaryButton: {
    padding: '10px 24px',
    background: colors.WHITE(),
    borderRadius: 4,
    color: colors.NEW_BLUE(),
    fontSize: 16,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      backgroundColor: colors.WHITE(0.9),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: '100%',
      minWidth: 200,
      maxWidth: 280,
      textAlign: 'center',
    },
  },
  secondaryButton: {
    padding: '10px 24px',
    border: `1px solid ${colors.WHITE()}`,
    borderRadius: 4,
    color: colors.WHITE(),
    fontSize: 16,
    fontWeight: 500,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      backgroundColor: colors.WHITE(0.1),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: '100%',
      minWidth: 200,
      maxWidth: 280,
      textAlign: 'center',
    },
  },
  featuresSection: {
    background: colors.WHITE(),
    padding: "80px 0 80px",
    width: "100%",
  },
  featuresTitle: {
    fontFamily: "Roboto",
    fontSize: 40,
    fontWeight: 500,
    lineHeight: "40px",
    textAlign: "center",
    color: "#241F3A",
    margin: "0 0 16px",
  },
  featuresDescription: {
    width: 800,
    margin: "0 auto 60px",
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: "140%",
    textAlign: "center",
    color: "#7C7989",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 'auto',
      margin: "0 24px 40px",
      fontSize: 15,
    },
  },
  featuresGrid: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 24,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gridTemplateColumns: "1fr",
      padding: "0 24px",
      gap: 16,
      maxWidth: 400,
      margin: "0 auto",
      alignItems: "center",
      justifyItems: "center",
    },
  },
  featureCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 24,
    gap: 40,
    background: colors.NEW_BLUE(),
    borderRadius: 8,
    transition: "all 0.2s ease-in-out",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: '70%',
      minWidth: 280,
      maxWidth: 400,
    },
  },
  featureIcon: {
    fontSize: 32,
    color: colors.WHITE(),
    margin: 0,
  },
  featureContent: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: "22px",
    color: colors.WHITE(),
    margin: 0,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: "140%",
    color: colors.WHITE(),
    opacity: 0.6,
    margin: 0,
  },
  subtleGradientSection: {
    background: `linear-gradient(to bottom, ${colors.BLUE(0.02)}, ${colors.BLUE(0.06)})`,
    padding: "40px 0",
    position: "relative",
    borderTop: `1px solid ${colors.GREY_LINE(0.5)}`,
    borderBottom: `1px solid ${colors.GREY_LINE(0.5)}`,
  },
  featureList: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    maxWidth: 930,
    width: '100%',
    flexWrap: 'wrap',
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '0 24px',
      marginBottom: 20,
    },
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: '100%',
      justifyContent: 'center',
      padding: '0 16px',
      flexDirection: 'column',
    },
  },
  checkIcon: {
    color: colors.YELLOW(),
    fontSize: 24,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 20,
    },
  },
  featureText: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: 500,
    color: colors.WHITE(0.75),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
      textAlign: 'center',
      width: '80%',
    },
  },
  bulletList: {
    color: colors.WHITE(),
    opacity: 0.6,
    fontSize: 16,
    lineHeight: '140%',
    paddingLeft: 20,
    margin: 0,
  },
});

export default ResearchHubJournalPage;
