import { css } from "aphrodite";
import { ReactElement } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";
import HomeSidebarFeaturedDocsSection from "./HomeSidebarFeaturedDocsSection";

export default function HomeRightSidebar(): ReactElement {
  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <HomeSidebarBountiesSection />
        <HomeSidebarFeaturedDocsSection />
      </ColumnContainer>
    </div>
  );
}
