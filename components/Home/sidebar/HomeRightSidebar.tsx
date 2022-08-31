import { css } from "aphrodite";
import { ReactElement } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import RhCarousel from "~/components/shared/carousel/RhCarousel";
import RhCarouselItem from "~/components/shared/carousel/RhCarouselItem";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

export default function HomeRightSidebar(): ReactElement {
  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <ExitableBanner
          bannerKey={"$rhRightSidebarInfoCarousel"}
          content={
            <RhCarousel rhCarouselItemProps={[{ title: "", body: "yoyo" }]} />
          }
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            width: "280px !important",
            borderRadius: 6,
            height: 152,
            margin: 16,
            padding: 16,
          }}
          exitButton={
            <div style={{ width: 12, height: 12, fontSize: 12 }}>
              {icons.times}
            </div>
          }
          exitButtonPositionOverride={{ top: "4px !important", right: "4px !important" }}
        />
        <HomeSidebarBountiesSection />
        <HomeSidebarFeaturedDocsSection />
      </ColumnContainer>
    </div>
  );
}
