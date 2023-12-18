import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { css } from "aphrodite";
import { getEducationalCarouselElements } from "~/components/shared/carousel/presets/RhEducationalCarouselElements";
import {
  INFO_TAB_EXIT_KEY,
  PREREG_FUNDING_EXIT_KEY,
} from "~/components/Banner/constants/exitable_banner_keys";
import { ReactElement, useState } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import ExitableBanner from "~/components/Banner/ExitableBanner";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";

import RhCarousel from "~/components/shared/carousel/RhCarousel";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import Link from "next/link";
import RHLogo from "../RHLogo";

export default function HomeRightSidebar(): ReactElement {
  const [shouldLimitNumCards, setShouldLimitNumCards] = useState<boolean>(true);
  let carouselElements = getEducationalCarouselElements();

  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  carouselElements = currentUser?.isVerified ? carouselElements.slice(1) : carouselElements;

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
        /> */}
        {/* TODO: Remove after preregistrations close */}
        <ExitableBanner
          bannerKey={PREREG_FUNDING_EXIT_KEY}
          content={
            <Link
              target="_blank"
              href="https://forms.gle/QYuEa6YyDeGxSNxh9"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(149deg, #B5499D 20.48%, #5735A3 71.51%)",
                  padding: 20,
                  boxSizing: "border-box",
                  borderRadius: 4,
                }}
              >
                <RHLogo withText white />
                <div
                  style={{
                    fontSize: 29,
                    fontWeight: 600,
                    marginTop: 16,
                    color: "white",
                  }}
                >
                  Get your experiment funded on ResearchHub
                </div>
                <div
                  style={{
                    fontSize: 14,
                    marginTop: 8,
                    color: "white",
                    lineHeight: 1.4,
                  }}
                >
                  Submit a preregistration to be eligible for crowdfunding
                </div>
                <div
                  style={{
                    marginTop: 24,
                    background: "#FFCD33",
                    color: "#593F94",
                    fontWeight: 500,
                    padding: "11px 0px",
                    width: "100%",
                    display: "inline-block",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  Apply for Funding
                </div>
                <div
                  style={{
                    color: "#FFCD33",
                    fontSize: 12,
                    marginTop: 12,
                    fontWeight: 400,
                    paddingBottom: 4,
                  }}
                >
                  Submissions close on January 15
                </div>
              </div>
            </Link>
          }
          contentStyleOverride={{
            margin: 16,
          }}
          exitButton={
            <div style={{ fontSize: 18, color: "white" }}>
              {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
            </div>
          }
          exitButtonPositionOverride={{
            top: "16px !important",
            right: "16px !important",
          }}
        />
        <HomeSidebarBountiesSection shouldLimitNumCards={shouldLimitNumCards} />
      </ColumnContainer>
    </div>
  );
}
