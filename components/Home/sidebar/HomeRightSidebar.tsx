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
import icons from "~/config/themes/icons";
import RhCarousel from "~/components/shared/carousel/RhCarousel";
import Button from "~/components/Form/Button";
import Link from "next/link";

export default function HomeRightSidebar(): ReactElement {
  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
  const carouselElements = getEducationalCarouselElements();

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        {/*
          Kobe 02-01-23: This is a static banner that temporarily replaces
          the RH slider
        */}
        <div
          style={{
            background: "rgb(78,83,255)",
            background:
              "linear-gradient(180deg, rgba(78,83,255,1) 30%, rgba(255,205,3,1) 100%)",
            borderRadius: 6,
            // height: 240,
            margin: 16,
            padding: "24px 16px 14px",
            boxSizing: "border-box",
          }}
        >
          <span style={{ color: "white" }}>
            <div style={{ marginBottom: 8 }}>
              {icons.calendar}
              <span> Feb 3rd - Feb 19th</span>
            </div>
            <div style={{ fontWeight: 500, fontSize: 20, marginBottom: 8 }}>
              {" Reputation Hackathon 2023"}
            </div>
            <div style={{ marginBottom: 20, fontSize: 16 }}>
              Join hackers, builders, and scientists to design a better
              reputation algorithm for academic research.
            </div>
            <div>
              <Link
                href="https://researchhubcommunity.com"
                style={{ textDecoration: "none" }}
                target="_blank"
              >
                <Button hideRipples fullWidth label={"Sign up"} />
              </Link>
            </div>
          </span>
        </div>
        {/* <ExitableBanner
          bannerKey={INFO_TAB_EXIT_KEY}
          content={<RhCarousel rhCarouselItems={carouselElements} />}
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            borderRadius: 6,
            height: 240,
            margin: 16,
            padding: "24px 16px 14px",
          }}
          exitButton={<div style={{ fontSize: 16 }}>{icons.times}</div>}
          exitButtonPositionOverride={{
            top: "16px !important",
            right: "16px !important",
          }}
          onExit={(): void => setShouldLimitNumCards(false)}
        /> */}
        <HomeSidebarBountiesSection shouldLimitNumCards={shouldLimitNumCards} />
        <HomeSidebarFeaturedDocsSection
          shouldLimitNumCards={shouldLimitNumCards}
        />
      </ColumnContainer>
    </div>
  );
}
