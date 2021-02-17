import React from "react";
import Router from "next/router";

// Components
import Head from "~/components/Head";
import HubPage from "~/components/Hubs/HubPage";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { toTitleCase } from "~/config/utils";
import { getInitialScope } from "~/config/utils/dates";
import {
  slugToFilterQuery,
  calculateScopeFromSlug,
} from "~/config/utils/routing";
import { filterOptions, scopeOptions } from "~/config/utils/options";

class Index extends React.Component {
  static async getInitialProps(ctx) {
    let { query } = ctx;

    let page = query.page ? query.page : 1;
    let filter = query.filter && slugToFilterQuery(query.filter);
    let scope = query.scope
      ? calculateScopeFromSlug(query.scope)
      : getInitialScope();

    try {
      const { slug, name } = ctx.query;
      const currentHub = await fetch(API.HUB({ slug }), API.GET_CONFIG())
        .then((res) => res.json())
        .then((body) => body.results[0]);

      const PARAMS = {
        ordering: filter,
        timePeriod: scope,
        page: page || 1,
        hubId: currentHub.id,
      };

      if (filter === "pulled-papers") {
        PARAMS.ordering = "hot";
        PARAMS.externalSource = "True";
      }

      const [initialFeed, leaderboardFeed, initialHubList] = await Promise.all([
        fetch(API.GET_HUB_PAPERS(PARAMS), API.GET_CONFIG()).then((res) =>
          res.json()
        ),
        fetch(
          API.LEADERBOARD({ limit: 10, page: 1, hubId: currentHub.id }), // Leaderboard
          API.GET_CONFIG()
        ).then((res) => res.json()),
        fetch(API.SORTED_HUB({}), API.GET_CONFIG()).then((res) => res.json()),
      ]);

      let filterObj = filterOptions.filter((el) => el.value === filter)[0];

      if (filter === "pulled-papers") {
        filterObj = {
          value: "pulled-papers",
          href: "pulled-papers",
          label: "Pulled Papers",
          disableScope: true,
        };
      } else if (filter === "removed") {
        filterObj = {
          value: "removed",
          label: "Removed",
          href: "removed",
        };
      }

      const scopeObj = scopeOptions.filter((el) => el.value === query.scope)[0];

      return {
        slug,
        name,
        currentHub,
        initialProps: {
          initialFeed,
          leaderboardFeed,
          initialHubList,
        },
        filter: filterObj,
        scope: scopeObj,
      };
    } catch {
      let defaultProps = {
        initialFeed: null,
        leaderboardFeed: null,
        initialHubList: null,
      };

      return {
        slug: null,
        name: null,
        currentHub: null,
        initialProps: { ...defaultProps },
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

  render() {
    const { currentHub, slug } = this.state;
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
        <HubPage
          hub={currentHub}
          slug={slug}
          {...this.props.initialProps}
          filter={this.props.filter}
          scope={this.props.scope}
        />
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
