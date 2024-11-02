import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import { INFO_TAB_EXIT_KEY } from "~/components/Banner/constants/exitable_banner_keys";
import { ReactElement, useState, useEffect } from "react";
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
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import UnifiedCarousel from "./UnifiedCarousel";

export default function HomeRightSidebar(): ReactElement | null {
  const auth = useSelector((state: RootState) => state.auth);
  const [dismissStatus, setDismissStatus] = useState<"unchecked" | "checked">("unchecked");
  
  const {
    isDismissed: isCarouselDismissed,
    dismissFeature: dismissCarousel,
    dismissStatus: carouselDismissStatus,
  } = useDismissableFeature({ auth, featureName: "educational-carousel" });

  // Don't render anything until we've confirmed the dismissal state
  if (carouselDismissStatus === "unchecked") {
    return null;
  }

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        {!isCarouselDismissed && carouselDismissStatus === "checked" && (
          <UnifiedCarousel
            onDismissCarousel={dismissCarousel}
          />
        )}
        <HomeSidebarBountiesSection shouldLimitNumCards={!isCarouselDismissed} />
      </ColumnContainer>
    </div>
  );
}