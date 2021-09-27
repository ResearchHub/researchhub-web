import { toTitleCase } from "~/config/utils/string";
import Error from "next/error";
import HubFeedWrapper from "~/components/Hubs/HubFeedWrapper";
import { Component } from "react";
import Head from "~/components/Head";

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
        <HubFeedWrapper hub={currentHub} slug={slug} {...this.props} />
      </div>
    );
  }
}
