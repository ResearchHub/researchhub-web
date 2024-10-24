import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/pro-regular-svg-icons";

const publicationTypes = [
  {
    title: "Original Research",
    description: "Full research papers presenting novel findings",
  },
  {
    title: "Case Study",
    description: "Detailed examination of a particular case within a real-world context",
  },
  {
    title: "Short Communications",
    description: "Brief reports of significant findings",
  },
  {
    title: "Review Articles",
    description: "Comprehensive analysis of existing literature",
  },
];

export const PublicationTypes = () => {
  const handleCardClick = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      // Calculate scroll position
      const viewportHeight = window.innerHeight;
      const sectionHeight = howItWorksSection.offsetHeight;
      const offset = howItWorksSection.offsetTop - (viewportHeight - sectionHeight) / 2;
      
      // First scroll to position
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });

      // Wait for scroll to complete before triggering accordion
      setTimeout(() => {
        // Dispatch event to force open the author guidelines section
        const event = new CustomEvent('setAccordionState', {
          detail: { 
            id: 'author-guidelines',
            state: true 
          }
        });
        window.dispatchEvent(event);
      }, 700); // Added delay to ensure scroll completes first
    }
  };

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.content)}>
        <div className={css(styles.grid)}>
          {publicationTypes.map((type, index) => (
            <div 
              key={index} 
              className={css(
                styles.card,
                type.title === "Review Articles" && styles.reviewCard
              )}
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
            >
              <div className={css(styles.cardContent)}>
                {type.title === "Review Articles" && (
                  <div className={css(styles.reviewOverlay) + " reviewOverlay"}>
                    <FontAwesomeIcon 
                      icon={faUserLock}
                      className={css(styles.reviewLockIcon)}
                    />
                    <p className={css(styles.reviewMessage)}>
                      Review article submissions are invite only, please email the Editorial Board if you are interested.
                    </p>
                  </div>
                )}
                <h3 className={css(styles.cardTitle)}>{type.title}</h3>
                <p className={css(styles.cardDescription)}>{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "0px 0",
    width: "100%",
  },
  content: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  heading: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 32,
    textAlign: "center",
    color: colors.BLACK(0.9),
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 32,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gridTemplateColumns: "1fr",
    },
  },
  card: {
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    position: "relative",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      borderColor: colors.NEW_BLUE(0.1),
    },
    ":hover h3": {  // Direct hover selector instead of nested
      color: colors.NEW_BLUE(),
    },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 12,
    color: colors.BLACK(0.9),
    letterSpacing: "-0.01em",
    transition: "color 0.2s ease-in-out", // Specific transition for color
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 1.6,
    color: colors.BLACK(0.6),
  },
  lockIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    color: colors.BLACK(0.9),
    fontSize: 16,
  },
  reviewCard: {
    ":hover": {
      transform: "none",
      boxShadow: "none",
      borderColor: colors.GREY_LINE(0.5),
    },
    ":hover h3": {
      color: colors.BLACK(0.9),
    },
    ":hover .reviewOverlay": {  // Add this to handle the overlay display
      display: "flex",
    },
  },
  reviewOverlay: {
    display: "none",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.GREY(0.95),
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 24,
    textAlign: "center",
  },
  reviewLockIcon: {
    fontSize: 24,
    color: colors.BLACK(0.9),
    marginBottom: 16,
  },
  reviewMessage: {
    fontSize: 14,
    lineHeight: 1.5,
    color: colors.BLACK(0.8),
  },
});
