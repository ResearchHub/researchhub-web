import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";
import API from "~/config/api";
import moment from "moment";

import HubPage from "../components/Hubs/HubPage";

class Index extends React.Component {
  static async getInitialProps(ctx) {
    let scope = {
      start: moment()
        .startOf("day")
        .unix(),
      end: moment().unix(),
    };

    let res = await fetch(
      API.GET_HUB_PAPERS({
        hubId: 0,
        ordering: "hot",
        timePeriod: scope,
      }),
      API.GET_CONFIG()
    );

    let json = await res.json();

    return { papers: { ...json } };
  }

  render() {
    return <HubPage home={true} initialFeed={this.props.papers} />;
  }
}

var styles = StyleSheet.create({});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
