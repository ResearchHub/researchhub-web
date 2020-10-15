import React from "react";
import Router from "next/router";
import { connect } from "react-redux";

// Components
import Head from "~/components/Head";
import HubPage from "~/components/Hubs/HubPage";
import Error from "next/error";

// Redux
import { AuthActions } from "~/redux/auth";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { toTitleCase } from "~/config/utils";
import { getInitialScope } from "~/config/utils/dates";

const isServer = () => typeof window === "undefined";

class Index extends React.Component {
  static async getInitialProps(ctx) {
    const { res, slug, name } = ctx.query;

    let defaultProps = {
      initialFeed: null,
      leaderboardFeed: null,
      initialHubList: null,
    };

    if (!isServer()) {
      return {
        slug,
        name,
        initialProps: {},
      };
    }

    try {
      const currentHub = await fetch(API.HUB({ slug }), API.GET_CONFIG())
        .then((res) => res.json())
        .then((body) => body.results[0]);

      if (!currentHub) {
        throw 404;
      }

      const [initialFeed, leaderboardFeed, initialHubList] = await Promise.all([
        fetch(
          API.GET_HUB_PAPERS({
            // Initial Feed
            hubId: currentHub.id,
            ordering: "hot",
            timePeriod: getInitialScope(),
          }),
          API.GET_CONFIG()
        ).then((res) => res.json()),
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
    } catch {
      if (res) {
        res.statusCode = 404;
      }

      return {
        slug: null,
        name: null,
        currentHub: null,
        initialProps: { ...defaultProps },
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
    if (!this.props.initialProps) {
      this.fetchHubInfo(this.state.slug);
    }
  }

  componentDidUpdate(prevProp) {
    if (Router.router.query.slug !== this.state.slug) {
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
    const currentHub = await fetchHub(name);
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
        {/* {this.renderHub()} */}
        <HubPage hub={currentHub} slug={slug} {...this.props.initialProps} />
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

export default Index;
