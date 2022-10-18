import { css } from "aphrodite";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { faPeopleGroup } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { INFO_TAB_EXIT_KEY } from "~/components/Banner/constants/exitable_banner_keys";
import { ReactElement, useState } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";
import icons from "~/config/themes/icons";
import RhCarousel from "~/components/shared/carousel/RhCarousel";

export default function HomeRightSidebar(): ReactElement {
  const carouselElements = [
    {
      title: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
          <span style={{ fontSize: "24px", marginRight: 15, }}>{icons.books}</span>
          {" Join us for a journal club on October 19 at 2pm PT"}
        </div>
      ),
      body: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
          Join the ResearchHub community on for a journal club hosted by Dr. Oliver Brown discussing the paper behind the post 
          <ALink
            target="__blank"
            theme="solidPrimary"
            href="https://www.researchhub.com/paper/1273284/the-impact-of-coffee-subtypes-on-incident-cardiovascular-disease-arrhythmias-and-mortality-long-term-outcomes-from-the-uk-biobank)"
          >
            &nbsp;2–3 cups of coffee per day is associated with significant reductions in incident CVD and mortality
          </ALink>
          <br/>
          
          <ALink
            target="__blank"
            theme="solidPrimary"
            href="https://ama.researchhub.com/coffee"
          ><span style={{ textDecoration: "underline" }}>More info</span></ALink>
        </div>
      ),
    },    
    {
      title: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
          <img
            src="/static/beaker.svg"
            style={{ marginRight: 6, marginTop: -3, height: 20 }}
          />
          {" What is ResearchHub?"}
        </div>
      ),
      body: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
          {
            "A tool for the open publication and discussion of scientific research. ResearchHub’s users are rewarded with ResearchCoin (RSC) for publishing, reviewing, criticizing, and collaborating in the open."
          }
        </div>
      ),
    },
    {
      title: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
          <span style={{ marginRight: 8, marginTop: 3 }}>
            {icons.RSC({
              style: styles.RSC,
            })}
          </span>
          {" What is ResearchCoin (RSC)?"}
        </div>
      ),
      body: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
          {
            "ResearchCoin (RSC) is a token that empowers the scientific community of ResearchHub. Once earned, RSC gives users the ability to create bounties, tip other users, and gain voting rights within community decision making."
          }
        </div>
      ),
    },
    {
      title: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
          <span style={{ marginRight: 8, fontSize: "20px" }}>
            {/* @ts-ignore FontAwesome faulty ts error */}
            <FontAwesomeIcon icon={faPeopleGroup} color={colors.BLUE()} />
          </span>
          {" Community"}
        </div>
      ),
      body: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
          <span>
            {
              "We’re a collection of skeptical, yet optimistic individuals who want to accelerate the pace of science. We think the incentives of scientific funding and publishing are broken, and that blockchain can help. If you'd like, "
            }
            <ALink
              target="__blank"
              theme="solidPrimary"
              href="https://discord.gg/researchhub"
            >
              <span style={{ textDecoration: "underline" }}> Join us.</span>
            </ALink>
          </span>
        </div>
      ),
    },
  ];

  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
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
            padding: "24px 16px 14px",
          }}
          exitButton={
            <div style={{ fontSize: 14, padding: 8 }}>{icons.times}</div>
          }
          exitButtonPositionOverride={{
            top: "16px !important",
            right: "20px !important",
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
