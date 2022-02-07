import { Component } from "react";
import Chart from "react-google-charts";

import Loader from "../../../Loader/Loader";

import { formatDate } from "~/config/utils/dates";
import { transformDate } from "~/redux/utils";

class PromotionGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      views: [
        ["x", "Views"],
        [0, 0],
      ],
      clicks: [
        ["x", "Clicks"],
        [0, 0],
      ],
      options: {},
      loading: true,
      refreshed: false,
    };
  }

  componentDidMount() {
    this.formatData("clicks", this.props.clicks);
    this.formatData("views", this.props.views);
  }

  formatData = (value, interactions = []) => {
    const data = [];
    data.push(["x", `${value[0].toUpperCase()}${value.slice(1)}`]);

    interactions.forEach((interaction) => {
      var date = formatDate(transformDate(interaction.date));
      var amount = interaction[value] ? interaction[value] : 0;
      data.push([date, amount]);
    });

    let options = {
      curveType: "function",
      axisFontSize: 0,
    };

    if (data.length === 1) {
      data.push([
        formatDate(transformDate(this.props.promotion.created_date)),
        0,
      ]);
      options.legend = { position: "top", alignment: "center" };
      options.series = { 0: { color: "rgb(78, 83, 255)" } };
      options.hAxis = {
        gridlines: {
          color: "transparent",
          count: 0,
        },
        minorGridlines: {
          color: "transparent",
          count: 0,
        },
        baselineColor: "transparent",
        textStyle: {
          fontSize: 8,
        },
      };
      options.vAxis = {
        gridlines: {
          color: "transparent",
          count: 0,
        },
        minorGridlines: {
          color: "transparent",
          count: 0,
        },
        baselineColor: "transparent",
        textStyle: {
          color: "#ffffff",
        },
      };
    } else if (data.length === 2) {
      options.legend = { position: "top", alignment: "center" };
      options.series = { 0: { color: "rgb(78, 83, 255)" } };
      options.hAxis = {
        gridlines: {
          color: "transparent",
          count: 0,
        },
        minorGridlines: {
          color: "transparent",
          count: 0,
        },
        baselineColor: "transparent",
        textStyle: {
          fontSize: 8,
        },
      };
      options.vAxis = {
        gridlines: {
          color: "transparent",
          count: 0,
        },
        minorGridlines: {
          color: "transparent",
          count: 0,
        },
        baselineColor: "transparent",
        textStyle: {
          color: "#ffffff",
        },
      };
    } else {
      let customOptions = {
        legend: {
          position: "top",
          alignment: "center",
          maxLines: 1,
        },
        series: {
          0: { color: "rgb(78, 83, 255)" },
        },
        backgroundColor: { fill: "transparent" },
        hAxis: {
          gridlines: {
            color: "transparent",
            count: 0,
          },
          minorGridlines: {
            color: "transparent",
            count: 0,
          },
          baselineColor: "transparent",
          textStyle: {
            fontSize: 8,
          },
        },
        vAxis: {
          gridlines: {
            color: "transparent",
            count: 0,
          },
          minorGridlines: {
            color: "transparent",
            count: 0,
          },
          baselineColor: "transparent",
          textStyle: {
            color: "#ffffff",
          },
        },
      };

      options = { ...options, ...customOptions };
    }

    this.setState({ [value]: data, options, loading: false });
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
