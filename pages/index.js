import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";

// Component

// Config
import HubPage from "../components/Hubs/HubPage";

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

const filterScope = [
  {
    value: "year",
    label: "This Year",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "day",
    label: "Today",
  },
];

class Index extends React.Component {
  getInitialProps = () => {
    // TODO: GET THE DATA HERE
  };

  render() {
    return <HubPage home={true} />;
  }
}

var styles = StyleSheet.create({});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
