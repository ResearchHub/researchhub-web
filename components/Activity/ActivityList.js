import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import ColumnContainer from "~/components/Paper/SideColumn/ColumnContainer";
import { SideColumnTitle } from "~/components/Typography";
import ActivityCard from "./ActivityCard";
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";
import Loader from "~/components/Loader/Loader";
import ActivityEmptyState from "./ActivityEmptyState";

// Config
import { fetchLatestActivity } from "~/config/fetch";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const DEFAULT_DATA = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const RenderActiviyList = ({ data }) => {
  const results = data.results || [];

  if (results.length) {
    return (
      <div className={css(styles.renderList)}>
        {results.map((activity, index) => {
          return (
            <ActivityCard
              activity={activity}
              key={`activityCard-${activity.id}`}
              last={results.length === index + 1}
            />
          );
        })}
      </div>
    );
  } else {
    return <ActivityEmptyState />;
  }
};

const RenderViewMore = ({ data, loadMore, isLoadingNext }) => {
  const { next } = data;
  if (!next) return null;

  return (
    <div className={css(styles.viewMoreButton)} onClick={loadMore}>
      {isLoadingNext ? (
        <Loader
          key={"activity-feed-loader"}
          loading={true}
          size={25}
          color={colors.BLUE()}
        />
      ) : (
        "View More"
      )}
    </div>
  );
};

const ActivityList = (props) => {
  const { auth, subscribedHubs, feed, hub, hubId } = props;
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    const fetchActivityFeed = async () => {
      setIsFetching(true);
      console.log(feed);
      console.log(hub);
      const hubIds =
        feed === 0
          ? subscribedHubs.map((hub) => hub.id)
          : hub
          ? [hub.id]
          : null;
      console.log(hubIds);
      const resData = await fetchLatestActivity({ hubIds });
      if (!resData.error) {
        setData(resData);
      }
      setIsFetching(false);
    };

    if (auth.authChecked) {
      fetchActivityFeed();
    }
  }, [auth.authChecked, hubId, feed]);

  const loadMore = () => {
    const { next } = data;
    if (!next) return;

    setIsLoadingNext(true);
    return fetch(next, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((nextData) => {
        const { results } = nextData;
        setData({
          ...data,
          results: [...data.results, ...results],
        });
        setIsLoadingNext(false);
      });
  };

  return (
    <ColumnContainer overrideStyles={styles.container}>
      <ReactPlaceholder
        ready={!isFetching}
        showLoadingAnimation
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={3} />}
      >
        <SideColumnTitle
          title={"Latest Activity"}
          overrideStyles={styles.title}
        />
        <RenderActiviyList data={data} />
        <RenderViewMore
          data={data}
          isLoadingNext={isLoadingNext}
          loadMore={loadMore}
        />
      </ReactPlaceholder>
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "sticky",
    top: 100,
    overflowY: "scroll",
    maxHeight: "100vh",
    borderRadius: 4,
  },
  renderList: {
    boxShadow:
      "inset 25px 0px 25px -25px rgba(255,255,255,1), inset -25px 0px 25px -25px rgba(255,255,255,1)",
  },
  title: {
    position: "sticky",
    top: 0,
    padding: "15px 20px 10px 20px",
    zIndex: 2,
    background: "#FFF",
    "@media only screen and (max-width: 415px)": {
      padding: "15px 0 5px",
    },
  },
  viewMoreButton: {
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: "15px 0 15px 20px",
    cursor: "pointer",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ActivityList);
