import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { css } from "aphrodite";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import {
  INFO_TAB_EXIT_KEY,
  SCICON_2023,
} from "~/components/Banner/constants/exitable_banner_keys";
import { ReactElement, useState } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";

import RhCarousel from "~/components/shared/carousel/RhCarousel";
import Button from "~/components/Form/Button";
import ResearchHubIcon from "~/static/ResearchHubIcon";
import RHLogo from "../RHLogo";
import Link from "next/link";

export default function HomeRightSidebar(): ReactElement {
  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
  const carouselElements = getEducationalCarouselElements();

  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        {/* <ExitableBanner
          bannerKey={INFO_TAB_EXIT_KEY}
          content={<RhCarousel rhCarouselItems={carouselElements} />}
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            borderRadius: 6,
            margin: 16,
            padding: "14px 16px 14px",
          }}
          exitButton={
            <div style={{ fontSize: 16 }}>
              {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
            </div>
          }
          exitButtonPositionOverride={{
            top: "16px !important",
            right: "16px !important",
          }}
          onExit={(): void => setShouldLimitNumCards(false)}
        />
        <HomeSidebarBountiesSection shouldLimitNumCards={shouldLimitNumCards} />
        <HomeSidebarFeaturedDocsSection
          shouldLimitNumCards={shouldLimitNumCards}
        /> */}
        {/* Will be removed after SciCon */}
        <ExitableBanner
          bannerKey={SCICON_2023}
          content={
            <Link
              target="_blank"
              href="https://researchhub.foundation/scicon"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  background: "linear-gradient(to bottom, #B74A9C, #5235A3)",
                  padding: 14,
                  boxSizing: "border-box",
                }}
              >
                <RHLogo withText white />
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    marginTop: 15,
                    color: "white",
                  }}
                >
                  SciCon 2023
                </div>
                <div
                  style={{
                    fontSize: 16,
                    marginTop: 2,
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  September 23-24
                </div>
                <div
                  style={{
                    marginTop: 20,
                    background: "#FECD03",
                    fontWeight: 500,
                    padding: "12px 0px",
                    width: "100%",
                    display: "inline-block",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  Register Now
                </div>
              </div>
            </Link>
          }
          contentStyleOverride={{
            background: colors.NEW_BLUE(0.07),
            borderRadius: 6,
            margin: 16,
            // padding: "14px 16px 14px",
          }}
          exitButton={
            <div style={{ fontSize: 16, color: "white" }}>
              {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
            </div>
          }
          exitButtonPositionOverride={{
            top: "16px !important",
            right: "16px !important",
          }}
        />
        <HomeSidebarBountiesSection shouldLimitNumCards={shouldLimitNumCards} />
        <HomeSidebarFeaturedDocsSection
          shouldLimitNumCards={shouldLimitNumCards}
        />
      </ColumnContainer>
    </div>
  );
}
