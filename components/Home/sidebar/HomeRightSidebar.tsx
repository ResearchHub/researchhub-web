import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import { INFO_TAB_EXIT_KEY } from "~/components/Banner/constants/exitable_banner_keys";
import { ReactElement, useState } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import { css, StyleSheet } from "aphrodite";
import RhCarousel from "~/components/shared/carousel/RhCarousel";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import VerificationSmallBanner from "~/components/Verification/VerificationSmallBanner";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import RHFPeerReviewsBanner from "~/components/PeerReviews/RHFPeerReviewsBanner";
import useCurrentUser from "~/config/hooks/useCurrentUser";

export default function HomeRightSidebar(): ReactElement | null {
  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
  const currentUser = useCurrentUser();
  let carouselElements = getEducationalCarouselElements();

  const auth = useSelector((state: RootState) => state.auth);
  const {
    isDismissed: isVerificationBannerDismissed,
    dismissFeature: dismissVerificationBanner,
  } = useDismissableFeature({ auth, featureName: "verification-banner" });

  const {
    isDismissed: isPeerReviewBannerDismissed,
    dismissFeature: dismissPeerReviewBanner,
  } = useDismissableFeature({ auth, featureName: "peer-review-banner" });

  // Explicitly check for logged in state first
  const isLoggedIn = Boolean(currentUser);

  // Only show verification banner if user is logged in, unverified, and hasn't dismissed
  const isVerificationBannerVisible = Boolean(
    isLoggedIn && 
    !currentUser.isVerified && 
    !isVerificationBannerDismissed
  );

  // Only show peer review banner if:
  // 1. User is logged in
  // 2. Banner isn't dismissed
  // 3. Verification banner isn't showing (lower priority)
  const isPeerReviewBannerVisible = Boolean(
    isLoggedIn && 
    !isPeerReviewBannerDismissed && 
    !isVerificationBannerVisible
  );

  // Update carousel visibility logic to check both banners
  const shouldShowCarousel = !isVerificationBannerVisible && !isPeerReviewBannerVisible;

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        {/* Show verification banner with highest priority */}
        {isVerificationBannerVisible && (
          <div className={css(sidebarStyles.bannerWrapper)}>
            <VerificationSmallBanner handleDismiss={dismissVerificationBanner} />
          </div>
        )}

        {/* Show peer review banner if verification isn't showing */}
        {isPeerReviewBannerVisible && (
          <div className={css(sidebarStyles.bannerWrapper)}>
            <RHFPeerReviewsBanner handleDismiss={dismissPeerReviewBanner} />
          </div>
        )}

        {/* Show carousel when neither banner is showing */}
        {shouldShowCarousel && (
          <ExitableBanner
            bannerKey={INFO_TAB_EXIT_KEY}
            content={<RhCarousel rhCarouselItems={carouselElements} />}
            contentStyleOverride={{
              background: colors.NEW_BLUE(0.07),
              borderRadius: 6,
              margin: 16,
              padding: "14px 16px 14px",
            }}
            exitButton={
              <div style={{ fontSize: 16 }}>
                {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
              </div>
            }
            exitButtonPositionOverride={{
              top: "16px !important",
              right: "16px !important",
            }}
            onExit={(): void => setShouldLimitNumCards(false)}
          />
        )}
        
        <HomeSidebarBountiesSection shouldLimitNumCards={shouldLimitNumCards} />
      </ColumnContainer>
    </div>
  );
}

const sidebarStyles = StyleSheet.create({
  bannerWrapper: {
    padding: "22px 20px 10px",
    marginTop: 16,
    "@media only screen and (max-width: 767px)": {
      padding: "16px 16px 8px", // Adjust padding for mobile
    },
  },
});
