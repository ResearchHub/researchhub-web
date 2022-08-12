import { css } from "aphrodite";
import { ReactElement } from "react";
import { SideColumnTitle } from "~/components/Typography";
import { styles } from "./styles/RhHomeRightSidebarStyles";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

export default function RhHomeSidebarBountiesSection(): ReactElement {
  return (
    <ReactPlaceholder
      ready
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={3} />}
    >
      <SideColumnTitle
        title={"Open Bounties"}
        overrideStyles={styles.RightSidebarTitle}
      />
    </ReactPlaceholder>
  );
}
