import { Fragment } from "react";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { SideColumnTitle } from "~/components/Typography";
import { StyleSheet } from "aphrodite";
import HubCard from "./HubCard";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

const ColumnHubs = (props) => {
  const { paper, hubs } = props;

  if (Array.isArray(hubs) && hubs.length === 0) {
    return null;
  }

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
      ready={!isNullOrUndefined(hubs)}
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
    margin: "15px 0px 0px",
  },
});

export default ColumnHubs;
