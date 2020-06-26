import React from "react";
import { StyleSheet, css } from "aphrodite";
import Chart from "react-google-charts";

import Loader from "../../../Loader/Loader";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { formatTransactionDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";

class PromotionGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      views: [["x", "Views"], [0, 0]],
      clicks: [["x", "Clicks"], [0, 0]],
      data: [],
      options: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchInteractions("CLICK");
    this.fetchInteractions("VIEW");
  }

  fetchInteractions = (value) => {
    let paperId = this.props.paper.id;
    fetch(
      API.PROMOTION_STATS({ paperId, interaction: value }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let key = `${value.toLowerCase()}s`;
        this.props.setCount(key, res.count);
        if (res.count) {
          this.formatData(key, res.results);
        }
        if (value === "VIEW") {
          this.setState({ loading: false });
        }
      });
  };

  formatData = (value, interactions) => {
    let data = [];

    var dates = {};
    var max = 0;
    interactions.forEach((interaction) => {
      var date = formatTransactionDate(transformDate(interaction.created_date));
      if (dates[date]) {
        dates[date]++;
      } else {
        dates[date] = 1;
      }
    });

    for (var key in dates) {
      data.push([key, dates[key]]);
      max = Math.max(max, dates[key]);
    }

    data.push(["x", `${value[0].toUpperCase()}${value.slice(1)}`]);

    let options = {
      curveType: "function",
      legend: { position: "bottom" },
      vAxis: { viewWindow: { min: 0, max: max + 1 } },
    };

    this.setState({ [value]: data.reverse(), options });
  };

  formatOptions = () => {
    this.setState({ options });
  };

  render() {
    /**
     * Add loading state, add empty state, wait to calls are made before showing graph
     */

    if (this.state.loading) {
      return <Loader loading={true} size={25} />;
    } else {
      return (
        <Chart
          chartType="LineChart"
          width="100%"
          height="100%"
          data={this.props.showViews ? this.state.views : this.state.clicks}
          options={this.state.options}
          loader={<div>Loading Chart</div>}
          rootProps={{ "data-testid": "1" }}
        />
      );
    }
  }
}

export default PromotionGraph;
