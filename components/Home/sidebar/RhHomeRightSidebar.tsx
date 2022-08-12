import { css } from "aphrodite";
import { ReactElement } from "react";
import { styles } from "./styles/RhHomeRightSidebarStyles";
import ColumnContainer from "../../Paper/SideColumn/ColumnContainer";
import RhHomeSidebarBountiesSection from "./RhHomeSidebarBountiesSection";

export default function RhHomeRightSidebar(): ReactElement {
  return (
    <div className={css(styles.RhHomeRightSidebar)}>
      <ColumnContainer overrideStyles={styles.RhHomeRightSidebarContainer}>
        <RhHomeSidebarBountiesSection />
      </ColumnContainer>
    </div>
  );
}
