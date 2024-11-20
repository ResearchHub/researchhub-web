import { ReactElement, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/pro-light-svg-icons";
import { CloseIcon } from "~/config/themes/icons";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { getJournalCarouselElements } from "~/components/ResearchHubJournal/RhJournalCarouselElement";
import { getVerificationCarouselElements } from "~/components/Verification/VerificationCarouselElement";
import colors from "~/config/themes/colors";
import useCurrentUser from "~/config/hooks/useCurrentUser";

type Props = {
  onDismissCarousel: () => void;
};

export default function UnifiedCarousel({
  onDismissCarousel,
}: Props): ReactElement | null {
  const [carouselElements, setCarouselElements] = useState<Array<any>>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const educationalElements = await getEducationalCarouselElements();
        const verificationElements = await getVerificationCarouselElements();
        const journalElements = getJournalCarouselElements();

        const elements = [
          ...(currentUser ? journalElements.map(element => ({
            type: 'journal',
            component: (
              <div className={css(styles.slideWrapper, styles.journalContainer)}>
                <div className={css(styles.journalBackground)} />
                <div className={css(styles.journalContent)}>
                  <div className={css(styles.titleArea)}>
                    {element.title}
                  </div>
                  <div className={css(styles.contentArea)}>
                    {element.body}
                  </div>
                </div>
              </div>
            )
          })) : []),
          ...(currentUser && !currentUser.isVerified ? verificationElements : []).map(element => ({
            type: 'verification',
            component: (
              <div className={css(styles.slideWrapper, styles.peerReviewContainer)}>
                <div className={css(styles.peerReviewBackground)} />
                <div className={css(styles.peerReviewContent)}>
                  <div className={css(styles.titleArea)}>
                    {element.title}
                  </div>
                  <div className={css(styles.contentArea)}>
                    {element.body}
                  </div>
                </div>
              </div>
            )
          })),
          ...educationalElements.map(element => ({
            type: 'educational',
            component: (
              <div className={css(styles.slideWrapper, styles.educationalSlide)}>
                <div className={css(styles.titleArea)}>
                  {element.title}
                </div>
                <div className={css(styles.contentArea)}>
                  {element.body}
                </div>
              </div>
            )
          }))
        ];

        setCarouselElements(elements);
      } catch (error) {
        console.error('Failed to load carousel content:', error);
        setError('Failed to load carousel content');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [currentUser]);

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Don't render if there was an error or no content
  if (error || carouselElements.length === 0) {
    return null;
  }

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.carouselWrapper)}>
        <div 
          className={css(
            styles.dismissButton,
            carouselElements[currentSlide].type !== 'educational' && styles.dismissButtonAlt
          )} 
          onClick={onDismissCarousel}
        >
          <CloseIcon 
            onClick={() => null}
            width={10}
            height={10}
            color={carouselElements[currentSlide].type !== 'educational' ? 'white' : undefined}
          />
        </div>
        <div className={css(styles.carouselContent)}>
          {carouselElements[currentSlide].component}
        </div>
        <div className={css(
          styles.navigation,
          carouselElements[currentSlide].type !== 'educational' && styles.navigationAlt
        )}>
          <button 
            onClick={() => setCurrentSlide((prev) => 
              (prev - 1 + carouselElements.length) % carouselElements.length
            )} 
            className={css(
              styles.navButton,
              carouselElements[currentSlide].type !== 'educational' && styles.navButtonAlt
            )}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </button>
          <div className={css(
            styles.indicators,
            carouselElements[currentSlide].type !== 'educational' && styles.indicatorsAlt
          )}>
            {carouselElements.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={css(
                  styles.indicator,
                  carouselElements[currentSlide].type !== 'educational' && styles.indicatorAlt,
                  currentSlide === index && styles.indicatorActive,
                  carouselElements[currentSlide].type !== 'educational' && 
                  currentSlide === index && 
                  styles.indicatorActiveAlt
                )}
              />
            ))}
          </div>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselElements.length)} 
            className={css(
              styles.navButton,
              carouselElements[currentSlide].type !== 'educational' && styles.navButtonAlt
            )}
          >
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '90%',
    background: 'white',
    borderRadius: 8,
    marginBottom: -10,
    padding: "16px",
  },
  carouselWrapper: {
    position: 'relative',
    background: colors.NEW_BLUE(0.07),
    borderRadius: 6,
    overflow: 'hidden',
    margin: "0 auto",
  },
  carouselContent: {
    height: 280,
    position: 'relative',
    overflow: 'hidden',
  },
  slideWrapper: {
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  },
  educationalSlide: {
    display: 'flex',
    textAlign: "left",
    flexDirection: 'column',
    padding: "16px 24px 48px 24px",
  },
  titleArea: {
    position: 'relative',
    zIndex: 2,
    height: 40,
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    ...DEFAULT_ITEM_STYLE.rhCarouselItemTitle,
  },
  contentArea: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    overflow: 'visible',
    ...DEFAULT_ITEM_STYLE.rhCarouselItemBody,
  },
  navigation: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    zIndex: 2,
    background: 'transparent',
  },
  navigationAlt: {
    color: 'white',
  },
  navButton: {
    background: colors.NEW_BLUE(0.0),
    border: 'none',
    cursor: 'pointer',
    color: colors.NEW_BLUE(),
    padding: "6px 8px",
    fontSize: 12,
    borderRadius: 4,
    ':hover': {
      background: colors.NEW_BLUE(0.2),
    },
    ':focus': {
      outline: 'none',
    },
  },
  navButtonAlt: {
    color: 'white',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  indicators: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    background: colors.NEW_BLUE(0.05),
    padding: "4px 12px",
    borderRadius: 12,
  },
  indicatorsAlt: {
    background: colors.WHITE(0.05),
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    margin: "0 4px",
    background: colors.NEW_BLUE(0.3),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  indicatorAlt: {
    background: colors.WHITE(0.3), // Semi-transparent white for inactive indicators
  },
  indicatorActive: {
    background: colors.NEW_BLUE(),
    transform: 'scale(1.2)',
  },
  indicatorActiveAlt: {
    background: colors.WHITE(),
    transform: 'scale(1.2)',
  },
  peerReviewIndicatorActive: {
    background: 'white',
  },
  dismissButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'pointer',
    zIndex: 3,
    color: colors.NEW_BLUE(),
    padding: 8,
    ':hover': {
      opacity: 0.8,
    },
  },
  dismissButtonAlt: {
    color: 'white',
  },
  peerReviewContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: "24px 32px 48px 32px",
  },
  peerReviewBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url('/static/background/small-banner-background.png')",
    backgroundRepeat: "round",
    opacity: 1,
    zIndex: 1,
  },
  peerReviewContent: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  journalContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: "24px 32px 48px 32px",
  },
  journalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.NEW_BLUE(),
    opacity: 1,
    zIndex: 1,
  },
  journalContent: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}); 
