import { AUTH_TOKEN } from "~/config/constants";
import { Component } from "react";
import { fetchUnifiedDocFeed } from "~/config/fetch";
import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { getInitialScope } from "~/config/utils/dates";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { isServer } from "~/config/server/isServer";
import { toTitleCase } from "~/config/utils/string";
import API from "~/config/api";
import Error from "next/error";
import fetchHubFromSlug from "~/pages/hubs/api/fetchHubFromSlug";
import Head from "~/components/Head";
import HubPage from "~/components/Hubs/HubPage";
import nookies from "nookies";
import Router from "next/router";

class Index extends Component {
  static async getInitialProps(ctx) {
    const { query } = ctx;
    const { res, slug, name, type } = query;
    const cookies = nookies.get(ctx);
    const authToken = cookies[AUTH_TOKEN];
    const currentHub = await fetchHubFromSlug({ slug });

    if (!isServer()) {
      return {
        slug,
        name,
        loggedIn: authToken !== undefined,
        initialProps: {},
        currentHub,
      };
    }

    if (!currentHub) {
      if (res) {
        res.statusCode = 404;
      }

      return { error: true };
    }

    try {
      const urlDocType = getBEUnifiedDocType(type);
      const fetchFeedWithVotes = !isNullOrUndefined(authToken);
      const [initialFeed, leaderboardFeed, initialHubList] = await Promise.all([
        fetchUnifiedDocFeed(
          {
            // Initial Feed
            hubId: currentHub?.id,
            ordering: "hot",
            timePeriod: getInitialScope(),
            type: urlDocType,
          },
          authToken,
          fetchFeedWithVotes /* withVotes */
        ),
        fetch(
          API.LEADERBOARD({ limit: 10, page: 1, hubId: currentHub.id }), // Leaderboard
          API.GET_CONFIG()
        ).then((res) => res.json()),
        fetch(API.SORTED_HUB({}), API.GET_CONFIG()).then((res) => res.json()),
      ]);

      return {
        slug,
        name,
        currentHub,
        initialProps: {
          initialFeed,
          leaderboardFeed,
          initialHubList,
        },
      };
    } catch (e) {
      console.log(e);
      if (res) {
        res.statusCode = 404;
      }
      return {
        slug: null,
        name: null,
        currentHub,
        initialProps: {
          initialFeed: null,
          leaderboardFeed: null,
          initialHubList: null,
        },
        error: true,
      };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.slug ? decodeURIComponent(this.props.slug) : "",
      currentHub: this.props.currentHub
        ? this.props.currentHub
        : {
            name: this.props.name
              ? this.props.name
                ? decodeURIComponent(this.props.name)
                : "ResearchHub"
              : "",
            slug: this.props.slug ? decodeURIComponent(this.props.slug) : "",
          },
      hubDescription: this.props.currentHub
        ? "Discuss and Discover " + toTitleCase(this.props.currentHub.name)
        : "Discuss and Discover " + toTitleCase(this.props.slug),
    };
  }

  componentDidMount() {
    if (!this.props.initialProps?.initialFeed) {
      this.fetchHubInfo(this.state.slug);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.slug !== this.props.slug) {
      this.setState(
        {
          slug: Router.router.query.slug,
        },
        () => {
          this.fetchHubInfo(Router.router.query.slug);
        }
      );
    }
  }

  fetchHubInfo = async (name) => {
    const currentHub = await fetchHubFromSlug({ slug: name });
    if (currentHub) {
      this.setState({
        currentHub,
        hubDescription: this.props.hub && this.props.hub.name,
      });
    }
  };

  renderHub = () => {
    const { currentHub, slug } = this.state;

    return (
      <HubPage
        hub={currentHub}
        slug={this.props.slug}
        {...this.props.initialProps}
      />
    );
  };

  render() {
    const { currentHub, slug } = this.state;
    if (this.props.error) {
      return <Error statusCode={404} />;
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
        <HubPage hub={currentHub} slug={slug} {...this.props.initialProps} />
      </div>
    );
  }
}

export default Index;
