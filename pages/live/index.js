import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";

// Component
import LiveFeed from "~/components/Hubs/LiveFeed";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { PaperActions } from "~/redux/paper";
import { UPVOTE_ENUM, DOWNVOTE_ENUM } from "~/config/constants";

const filterOptions = [
  {
    value: "top_rated",
    label: "Top Rated",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
  },
];

const scopeOptions = [
  {
    value: "week",
    label: "This Week",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "day",
    label: "Today",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const defaultFilter = filterOptions[0];
const defaultScope = scopeOptions[0];

class LiveFeedPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getLiveFeed();
  }

  getLiveFeed = () => {
    let { hub } = this.props;
    let hubId = 0;
    if (hub) {
      hubId = hub.id;
    }
    return fetch(API.GET_LIVE_FEED({ hubId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          liveFeed: res.results,
        });
      });
  };

  render() {
    let { auth } = this.props;

    return (
      <div className={css(styles.content)}>
        <LiveFeed currentHub={this.props.hub && this.props.hub} home={true} />
      </div>
    );
  }
}

var styles = StyleSheet.create({
  content: {
    width: "100%",
    height: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveFeedPage);
