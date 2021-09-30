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
  fetchTopHubs,
} from "~/config/fetch";
import { buildStaticPropsForFeed } from "~/config/utils/feed";

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

export async function getStaticPaths(ctx) {
  const topHubs = await fetchTopHubs();

  let paths = [];
  for (let i = 0; i < topHubs.length; i++) {
    paths.push(`/hubs/${topHubs[i].slug}/papers`);
    paths.push(`/hubs/${topHubs[i].slug}/posts`);
    paths.push(`/hubs/${topHubs[i].slug}/hypotheses`);
  }

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  const { slug: hubSlug, type: docType } = ctx.params;
  return buildStaticPropsForFeed({ docType, hubSlug });
}

export default Index;
