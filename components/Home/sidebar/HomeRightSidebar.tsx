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

export default function HomeRightSidebar(): ReactElement | null {
  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
  let carouselElements = getEducationalCarouselElements();

  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );



  const auth = useSelector((state: RootState) => state.auth);
  const {
    isDismissed: isVerificationBannerDismissed,
    dismissFeature: dismissVerificationBanner,
    dismissStatus: verificationBannerDismissStatus
  } = useDismissableFeature({ auth, featureName: "verification-banner" })


  const isVerificationBannerVisible = !currentUser?.isVerified && (verificationBannerDismissStatus === "checked" && !isVerificationBannerDismissed);


  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        {isVerificationBannerVisible ? (
          <div className={css(sidebarStyles.bannerWrapper)}>
            <VerificationSmallBanner handleDismiss={dismissVerificationBanner} />
          </div>
        ) : (
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
  },
});
