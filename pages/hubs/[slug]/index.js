import * as Sentry from "@sentry/nextjs";
import { AUTH_TOKEN } from "~/config/constants";
import { Component } from "react";
import { getInitialScope } from "~/config/utils/dates";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { Helpers } from "@quantfive/js-web-config";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { toTitleCase } from "~/config/utils/string";
import API from "~/config/api";
import Error from "next/error";
import Head from "~/components/Head";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import Router from "next/router";
import {
  fetchUnifiedDocFeed,
  fetchLatestActivity,
  fetchLeaderboard,
  fetchTopHubs,
} from "~/config/fetch";
import { getHubs } from "~/components/Hubs/api/fetchHubs";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.slug ? decodeURIComponent(this.props.slug) : "",
      currentHub: this.props.currentHub
        ? this.props.currentHub
        : {
            name: this.props.currentHub.name
              ? this.props.currentHub.name
                ? decodeURIComponent(this.props.currentHub.name)
                : "ResearchHub"
              : "",
            slug: this.props.slug ? decodeURIComponent(this.props.slug) : "",
          },
      hubDescription: this.props.currentHub
        ? "Discuss and Discover " + toTitleCase(this.props.currentHub.name)
        : "Discuss and Discover " + toTitleCase(this.props.slug),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.slug !== this.props.slug) {
      this.setState({
        slug: this.props.slug ? decodeURIComponent(this.props.slug) : "",
        currentHub: this.props.currentHub
          ? this.props.currentHub
          : {
              name: this.props.currentHub.name
                ? this.props.currentHub.name
                  ? decodeURIComponent(this.props.currentHub.name)
                  : "ResearchHub"
                : "",
              slug: this.props.slug ? decodeURIComponent(this.props.slug) : "",
            },
        hubDescription: this.props.currentHub
          ? "Discuss and Discover " + toTitleCase(this.props.currentHub.name)
          : "Discuss and Discover " + toTitleCase(this.props.slug),
      });
    }
  }

  render() {
    const { currentHub, slug } = this.state;

    if (this.props.error) {
      return <Error statusCode={this.props.error.code} />;
    }

    return (
      <div>
        {process.browser ? (
          <Head
            title={toTitleCase(this.state.currentHub.name) + " on ResearchHub"}
            description={this.state.hubDescription}
          />
        ) : (
          <Head
            title={
              this.props.currentHub
                ? toTitleCase(this.props.currentHub.name) + " on ResearchHub"
                : toTitleCase(this.props.slug) + " on ResearchHub"
            }
            description={
              this.props.currentHub
                ? "Discuss and Discover " +
                  toTitleCase(this.props.currentHub.name)
                : "Discuss and Discover " + toTitleCase(this.props.slug)
            }
          />
        )}
        <HubPage hub={currentHub} slug={slug} {...this.props} />
      </div>
    );
  }
}

function fetchHub(slug) {
  return fetch(API.HUB({ slug }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res.results[0]; // TODO: Shim and catch errors
    });
}

export async function getStaticPaths(ctx) {
  // Note: Doing this for all hubs causes a timeout on the server.
  // For now, we will only focus on top five hubs.
  const topHubs = await fetchTopHubs();

  return {
    paths: topHubs.slice(0, 5).map((h) => `/hubs/${h.slug}`),
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  const { slug, name } = ctx.params;

  const currentHub = await fetch(API.HUB({ slug }), API.GET_CONFIG())
    .then((res) => res.json())
    .then((body) => body.results[0]);

  if (!currentHub) {
    return {
      props: {
        error: {
          code: 404,
        },
      },
    };
  }

  const defaultProps = {
    initialFeed: null,
    leaderboardFeed: null,
    initialHubList: null,
  };

  const initialActivityPromise = fetchLatestActivity({
    hubIds: [currentHub.id],
  });
  const initialHubListPromise = fetchTopHubs();
  const leaderboardPromise = fetchLeaderboard({
    limit: 10,
    page: 1,
    hubId: currentHub.id,
    timeframe: "past_week",
  });
  const initialFeedPromise = fetchUnifiedDocFeed({
    hubId: currentHub.id,
    ordering: "hot",
    page: 1,
    subscribedHubs: false,
    timePeriod: getInitialScope(),
    type: "all",
  });

  let leaderboardFeed, initialFeed, initialHubList, initialActivity;
  try {
    [leaderboardFeed, initialFeed, initialHubList, initialActivity] =
      await Promise.all([
        leaderboardPromise,
        initialFeedPromise,
        initialHubListPromise,
        initialActivityPromise,
      ]);
  } catch (err) {
    console.log(err);
    Sentry.captureException({
      err,
      leaderboardFeed,
      initialFeed,
      initialHubList,
      initialActivity,
    });
  }

  return {
    revalidate: 10,
    props: {
      ...defaultProps,
      initialFeed,
      leaderboardFeed,
      initialHubList,
      initialActivity,
      currentHub,
      slug,
      key: slug,
    },
  };
}

export default Index;
