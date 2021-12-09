import { Fragment } from "react";
import { StyleSheet } from "aphrodite";
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
      <HubCard
        hub={hub}
        index={i}
        last={i === hubs.length - 1}
        key={`hubCard-${hub.id}`}
      />
    ));
  };

  return (
    <ReactPlaceholder
      showLoadingAnimation
      ready={!!(hubs && hubs.length > 0)} // needs to be boolean, not undefined
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
    >
      {paper && hubs && hubs.length > 0 && (
        <Fragment>
          <SideColumnTitle
            title={`${hubs.length > 1 ? "Hubs" : "Hub"}`}
            overrideStyles={styles.title}
          />
          {renderHubEntry()}
        </Fragment>
      )}
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
