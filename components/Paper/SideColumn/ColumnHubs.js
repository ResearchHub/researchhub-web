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
            />
            {renderHubEntry()}
          </Fragment>
        )}
      </div>
    </ReactPlaceholder>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: "15px 0 10px",
    "@media only screen and (max-width: 415px)": {
      margin: "15px 0 5px",
    },
  },
});

export default ColumnHubs;
