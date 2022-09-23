import { css } from "aphrodite";
import RhCarouselItem, {
  DEFAULT_ITEM_STYLE,
} from "~/components/shared/carousel/RhCarouselItem";
import { faPeopleGroup } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";
import icons from "~/config/themes/icons";
import RhCarousel from "~/components/shared/carousel/RhCarousel";
import ALink from "~/components/ALink";

const INFO_TAB_EXIT_KEY = "$infoCarouselWithGitcoinBanner$";

export default function HomeRightSidebar(): ReactElement {
  const carouselElements = [
    {
      onBodyClick: () =>
        window.open(
          "https://gitcoin.co/grants/4698/researchhub-a-github-for-science"
        ),
      title: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
          <img
            src="/static/beaker.svg"
            style={{ marginRight: 6, marginTop: -3, height: 20 }}
          />
          ResearchHub
          <span style={{ marginLeft: 10, marginRight: 10 }}>{icons.times}</span>
          <img
            src="/static/icons/gitcoin.svg"
            style={{ marginRight: 6, marginTop: -1, height: 22 }}
          />
          Gitcoin
        </div>
      ),
      body: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
          <span className={css(DEFAULT_ITEM_STYLE.emphasized)}>
            Funding ends 09/22. {` `}
          </span>
          Consider donating to the ResearchHub on Gitcoin.{" "}
          <span className={css(DEFAULT_ITEM_STYLE.emphasizedBlue)}>
            {
              "A $1 donation will get matched > $100 and all proceeds will go to the Community"
            }
          </span>{" "}
          to host online conferences, reward contributors and help cover
          community operations.{` `}
          <ALink
            theme="solidPrimary"
            href="https://gitcoin.co/grants/4698/researchhub-a-github-for-science"
          >
            <span style={{ textDecoration: "underline" }}>Donate here.</span>
          </ALink>
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
            "A tool for the open publication and discussion of scientific research. Researchhub’s users are rewarded with ResearchCoin (RSC) for publishing, reviewing, criticizing, and collaborating in the open."
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
            "ResearchCoin (RSC) is a token that empowers the scientific community of Research Hub. Once earned, RSC gives users the ability to create bounties, tip other users, and gain voting rights within community decision making."
          }
        </div>
      ),
    },
    {
      title: (
        <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
          <span style={{ marginRight: 8, fontSize: "20px" }}>
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

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <ExitableBanner
          bannerKey={INFO_TAB_EXIT_KEY}
          content={<RhCarousel rhCarouselItem={carouselElements} />}
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            borderRadius: 6,
            height: 240,
            margin: 16,
            padding: 16,
          }}
          exitButton={
            <div style={{ fontSize: 14, padding: 8 }}>{icons.times}</div>
          }
          exitButtonPositionOverride={{
            top: "0 !important",
            right: "0 !important",
          }}
        />
        <HomeSidebarBountiesSection />
        <HomeSidebarFeaturedDocsSection />
      </ColumnContainer>
    </div>
  );
}
