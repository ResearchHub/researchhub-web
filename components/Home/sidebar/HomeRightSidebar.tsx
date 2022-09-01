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
                      <img
                        src="/static/beaker.svg"
                        style={{ marginRight: 6, marginTop: -3, width: 12 }}
                      />
                      {" What is ResearchHub?"}
                    </div>
                  }
                  body={
                    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
                      {
                        "A blockchain token earned by users when they share scientific content on ResearchHub. Once earned, RSC gives users the ability to create bounties, tip other users, and gain voting rights within community decision making."
                      }
                    </div>
                  }
                  key={"what-is-researchhub?"}
                />,
                <RhCarouselItem
                  title={
                    <div
                      className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}
                    >
                      <span style={{ marginRight: 4, marginTop: 3 }}>
                        {icons.RSC()}
                      </span>
                      {" What is ResearchCoin (RSC)?"}
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
                  title={
                    <div
                      className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}
                    >
                      <span style={{ marginRight: 4 }}>{icons.user}</span>
                      {" Community"}
                    </div>
                  }
                  body={
                    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
                      <span>
                        {
                          "We’re a collection of skeptical, yet optimistic individuals who want to accelerate the pace of science. We think the incentives of scientific funding and publishing are broken, and that blockchain can help. If you'd like to "
                        }
                        <a
                          href="https://discord.gg/researchhub"
                          target="__blank"
                        >
                          {" join us"}
                        </a>
                      </span>
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
            height: 172,
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
