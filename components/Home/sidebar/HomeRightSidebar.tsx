import { css } from "aphrodite";
import { ReactElement } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import Carousel from "~/components/shared/carousel/Carousel";
import CarouselItem from "~/components/shared/carousel/CarouselItem";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

export default function HomeRightSidebar(): ReactElement {
  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <ExitableBanner
          bannerKey={"$rhRightSidebarInfoCarousel"}
          content={<Carousel carouselItems={[<CarouselItem />]} />}
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            width: "280px !important",
            borderRadius: 6,
            height: 152,
            margin: 16,
          }}
          exitButton={
            <div style={{ width: 16, height: 16, fontSize: 16 }}>
              {icons.times}
            </div>
          }
        />
        <HomeSidebarBountiesSection />
        <HomeSidebarFeaturedDocsSection />
      </ColumnContainer>
    </div>
  );
}
