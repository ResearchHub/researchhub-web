import { css } from "aphrodite";
import { ReactElement } from "react";
import { styles } from "./styles/HomeRightSidebarStyles";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import HomeSidebarBountiesSection from "./HomeSidebarBountiesSection";

export default function HomeRightSidebar(): ReactElement {
  return (
    <div className={css(styles.HomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.HomeRightSidebarContainer}>
        <HomeSidebarBountiesSection />
      </ColumnContainer>
    </div>
  );
}
