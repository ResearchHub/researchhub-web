import { css } from "aphrodite";
import RhCarouselItem, {
  DEFAULT_ITEM_STYLE,
} from "~/components/shared/carousel/RhCarouselItem";
import { ReactElement } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";
import icons from "~/config/themes/icons";
import RhCarousel from "~/components/shared/carousel/RhCarousel";

export default function HomeRightSidebar(): ReactElement {
  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <ExitableBanner
          bannerKey={"$rhRightSidebarInfoCarousel"}
          content={
            <RhCarousel
              rhCarouselItem={[
                <RhCarouselItem
                  title={
                    <div
                      className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}
                    >
                      <span style={{ marginRight: 4, marginTop: 3 }}>
                        {icons.RSC()}
                      </span>
                      {" What is ResearchCoin?"}
                    </div>
                  }
                  body={
                    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
                      {
                        "ResearchCoin (RSC) is a token that empowers the scientific community of Research Hub. Scientists can earn RSC by engaging in various activities that empower the acceleration and openness of science."
                      }
                    </div>
                  }
                  key={"what-is-rsc"}
                />,
                <RhCarouselItem
                  body={
                    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
                      {"CONTENT TBH 1"}
                    </div>
                  }
                  key={"what-is-long-text"}
                />,
                <RhCarouselItem
                  body={
                    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
                      {"CONTENT TBH 2"}
                    </div>
                  }
                  key={"what-is-long-text-2"}
                />,
              ]}
            />
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
          exitButtonPositionOverride={{
            top: "4px !important",
            right: "4px !important",
          }}
        />
        <HomeSidebarBountiesSection />
        <HomeSidebarFeaturedDocsSection />
      </ColumnContainer>
    </div>
  );
}
