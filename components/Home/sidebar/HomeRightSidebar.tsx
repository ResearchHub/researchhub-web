import { ReactElement, useState, useEffect } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import { css, StyleSheet } from "aphrodite";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import UnifiedCarousel from "./UnifiedCarousel";

export default function HomeRightSidebar(): ReactElement {
  const auth = useSelector((state: RootState) => state.auth);
  
  const {
    isDismissed: isCarouselDismissed,
    dismissFeature: dismissCarousel,
    dismissStatus: carouselDismissStatus,
  } = useDismissableFeature({ auth, featureName: "educational-carousel" });

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        {carouselDismissStatus === "checked" && !isCarouselDismissed && (
          <UnifiedCarousel
            onDismissCarousel={() => dismissCarousel()}
          />
        )}
        <HomeSidebarBountiesSection shouldLimitNumCards={!isCarouselDismissed} />
      </ColumnContainer>
    </div>
  );
}