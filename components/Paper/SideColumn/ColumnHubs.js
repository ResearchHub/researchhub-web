import { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { SideColumnTitle } from "~/components/Typography";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import HubCard from "./HubCard";

const ColumnHubs = (props) => {
  const { paper, hubs } = props;
  const [showHubs, toggleShowHubs] = useState(true);

  const renderHubEntry = () => {
    const { hubs } = props;

    return (hubs || []).map((hub, i) => (
      <HubCard hub={hub} index={i} last={i === hubs.length - 1} />
    ));
  };

  return (
    <ReactPlaceholder
      showLoadingAnimation
      ready={hubs}
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
    >
      <div>
        {paper && (hubs && hubs.length > 0) && (
          <Fragment>
            <SideColumnTitle
              title={`${hubs.length > 1 ? "Hubs" : "Hub"}`}
              overrideStyles={styles.title}
              onClick={() => toggleShowHubs(!showHubs)}
              state={showHubs}
              count={hubs.length}
            />
            {showHubs && renderHubEntry()}
          </Fragment>
        )}
      </div>
    </ReactPlaceholder>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: "15px 0 10px",
  },
});

export default ColumnHubs;
