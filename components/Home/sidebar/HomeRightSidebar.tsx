import { css } from "aphrodite";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import { INFO_TAB_EXIT_KEY } from "~/components/Banner/constants/exitable_banner_keys";
import { ReactElement, useState } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";

import RhCarousel from "~/components/shared/carousel/RhCarousel";
import { times } from "~/config/themes/icons";

export default function HomeRightSidebar(): ReactElement {
  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
  const carouselElements = getEducationalCarouselElements();

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <ExitableBanner
          bannerKey={INFO_TAB_EXIT_KEY}
          content={<RhCarousel rhCarouselItems={carouselElements} />}
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            borderRadius: 6,
            height: 240,
            margin: 16,
            padding: "14px 16px 14px",
          }}
          exitButton={<div style={{ fontSize: 16 }}>{times}</div>}
          exitButtonPositionOverride={{
            top: "16px !important",
            right: "16px !important",
          }}
          onExit={(): void => setShouldLimitNumCards(false)}
        />
        <HomeSidebarBountiesSection shouldLimitNumCards={shouldLimitNumCards} />
        <HomeSidebarFeaturedDocsSection
          shouldLimitNumCards={shouldLimitNumCards}
        />
      </ColumnContainer>
    </div>
  );
}
